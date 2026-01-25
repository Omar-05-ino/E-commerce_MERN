import { cartModel } from "../models/cartModel";
import { IOrderItem, orderModel } from "../models/orderModel";
import productModel from "../models/productModel";

interface ICreatCartForUser {
  userId: string;
}

const creatCartForUser = async ({ userId }: ICreatCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

interface IGetActiveCartForUser {
  userId: string;
}

export const getActiveCartForUser = async ({
  userId,
}: IGetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await creatCartForUser({ userId });
  }

  return cart;
};

interface IAddItemToCart {
  userId: string;
  productId: any;
  quantity: number;
}

export const addItemToCart = async ({
  userId,
  productId,
  quantity,
}: IAddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });
  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId.toString(),
  );
  if (existsInCart) {
    return { data: "Product already in cart", status: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found", status: 404 };
  }

  if (product.stock < quantity) {
    return { data: "Insufficient stock", status: 400 };
  }

  cart.items.push({
    product: productId,
    quantity,
    unitPrice: product.price,
  });

  cart.totalAmount += product.price * quantity;

  const updatedCart = await cart.save();

  return { data: updatedCart, status: 200 };
};

interface IUpdateItemInCart {
  userId: string;
  productId: any;
  quantity: number;
}

export const updateItemInCart = async ({
  userId,
  productId,
  quantity,
}: IUpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId.toString(),
  );

  if (!existsInCart) {
    return { data: "Product not in cart", status: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found", status: 404 };
  }

  if (product.stock < quantity) {
    return { data: "Insufficient stock", status: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId.toString(),
  );

  let total = otherCartItems.reduce((sum, product) => {
    sum += product.unitPrice * product.quantity;
    return sum;
  }, 0);

  existsInCart.quantity = quantity;
  total += existsInCart.unitPrice * existsInCart.quantity;
  cart.totalAmount = total;

  const updatedCart = await cart.save();

  return { data: updatedCart, status: 200 };
};

interface IDeleteItemFromCart {
  userId: string;
  productId: any;
}

export const deleteItemFromCart = async ({
  userId,
  productId,
}: IDeleteItemFromCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId.toString(),
  );

  if (!existsInCart) {
    return { data: "Product not in cart", status: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId.toString(),
  );

  const total = otherCartItems.reduce((sum, product) => {
    sum += product.unitPrice * product.quantity;
    return sum;
  }, 0);

  cart.totalAmount = total;
  cart.items = otherCartItems;
  const updatedCart = await cart.save();

  return { data: updatedCart, status: 200 };
};

interface IClearCart {
  userId: string;
}

export const clearCart = async ({ userId }: IClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, status: 200 };
};

interface ICheckout {
  userId: string;
  address: string;
}

export const checkout = async ({ userId , address }: ICheckout) => {
  if (!address) {
    return { data: "Address is required for checkout", status: 400 };
  }
  
  const cart = await getActiveCartForUser({ userId });

  const orderItems: IOrderItem[] = [];

  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    if (!product) {
      return { data: `Product with id ${item.product} not found`, status: 404 };
    }

    const orderItem: IOrderItem = {
      productTitle: product.title,
      productImage: product.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    };

    orderItems.push(orderItem);
  }

  const order = await orderModel.create({
    orderItems,
    totalAmount: cart.totalAmount,
    userId,
    address,
  });

  await order.save();

  cart.status = "completed";
  await cart.save();

  return { data: order, status: 200 };
};
