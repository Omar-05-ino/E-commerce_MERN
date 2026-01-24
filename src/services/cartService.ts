import { cartModel } from "../models/cartModel";

interface ICreatCartForUser {
  userId: string;
}

const creatCartForUser = async ({ userId }: ICreatCartForUser) => {
  const cart = await cartModel.create({ userId ,totalAmount:0});
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
