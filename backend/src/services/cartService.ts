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
  populateProduct?: boolean;
}

export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: IGetActiveCartForUser) => {
  let cart;

  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate("items.product"); // هذا السطر هو المسؤول عن جلب تفاصيل المنتج
  } else {
    cart = await cartModel.findOne({ userId, status: "active" });
  }

  if (!cart) {
    cart = await creatCartForUser({ userId });
    // إذا تم إنشاء سلة جديدة وأردنا عمل populate، لن يضر إعادة الطلب أو إرجاعها فارغة
    // لكن السلة الجديدة فارغة أصلاً لذا لا مشكلة
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
  try {
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

    await cart.save();

    // هنا الكود صحيح لأنه يعيد طلب السلة مع populate
    return {
      data: await getActiveCartForUser({ userId, populateProduct: true }),
      status: 200,
    };
  } catch (error) {
    return { data: "Error adding item to cart", status: 500 };
  }
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
  try {
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

    await cart.save();

    // ----------------------------------------------------
    // تم التعديل هنا: إعادة جلب البيانات مع populate
    // ----------------------------------------------------
    return { 
        data: await getActiveCartForUser({ userId, populateProduct: true }), 
        status: 200 
    };
    
  } catch (error) {
    return { data: "Error updating item in cart", status: 500 };
  }
};

interface IDeleteItemFromCart {
  userId: string;
  productId: any;
}

export const deleteItemFromCart = async ({
  userId,
  productId,
}: IDeleteItemFromCart) => {
  try {
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
    await cart.save();

    return {
      data: await getActiveCartForUser({ userId, populateProduct: true }),
      status: 200,
    };
  } catch (error) {
    return { data: "Error deleting item from cart", status: 500 };
  }
};

interface IClearCart {
    userId: string;
  }
  
  export const clearCart = async ({ userId }: IClearCart) => {
    try {
      const cart = await getActiveCartForUser({ userId });
      cart.items = [];
      cart.totalAmount = 0;
      const updatedCart = await cart.save();
      return { data: updatedCart, status: 200 };
    } catch (error) {
      return { data: "Error clearing cart", status: 500 };
    }
  };
  
  interface ICheckout {
    userId: string;
    address: string;
  }
  
  export const checkout = async ({ userId, address }: ICheckout) => {
    try {
      if (!address) {
        return { data: "Address is required for checkout", status: 400 };
      }
  
      const cart = await getActiveCartForUser({ userId });
  
      const orderItems: IOrderItem[] = [];
  
      for (const item of cart.items) {
        const product = await productModel.findById(item.product);
  
        if (!product) {
          return {
            data: `Product with id ${item.product} not found`,
            status: 404,
          };
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
    } catch (error) {
      return { data: "Error processing checkout", status: 500 };
    }
  };