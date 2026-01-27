import { get } from "mongoose";
import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const initialProducts = [
      {
        title: "Apple MacBook Air M2",
        image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-og-202503?wid=1200&hei=630&fmt=jpeg&qlt=90&.v=1739216814915",
        price: 999.00,
        stock: 50,
      },
      {
        title: "HP Spectre x360 14",
        image: "https://img-cdn.tnwcdn.com/image?fit=1280%2C720&url=https%3A%2F%2Fcdn0.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2021%2F08%2FHP-Spectre-x360-14-1-of-7.jpg&signature=b273734ba382a58d403431a960fd1708",
        price: 1249.99,
        stock: 32,
      },
      {
        title: "Lenovo ThinkPad X1 Carbon",
        image: "https://images.hepsiburada.net/description-assets/description-prod-30/4be8d17a-b68d-43fd-86ba-6933049d5b65.jpg",
        price: 1420.50,
        stock: 15,
      },
      
    ];

    const products = await getAllProducts();

    if (products.length === 0) {
      await productModel.insertMany(initialProducts);
    }
  } catch (error) {
    console.error("Error seeding initial products:", error);
  }
};
