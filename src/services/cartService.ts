import { cartModel } from "../models/cartModel";
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
  const existsInCart = cart.items.find((p) => p.product.toString() === productId.toString());
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
