import { get } from "mongoose";
import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  const initialProducts = [
    {
      title: "Dell laptop",
      image:
        "https://blogs.windows.com/wp-content/uploads/sites/2/2016/09/Dell-XPS-5.jpg",
      price: 19.99,
      stock: 100,
    },
    // {
    //   title: "Sample Product 2",
    //   image: "image2.jpg",
    //   price: 29.99,
    //   stock: 85,
    // },
    // {
    //   title: "Sample Product 3",
    //   image: "image3.jpg",
    //   price: 39.99,
    //   stock: 120,
    // },
    // {
    //   title: "Sample Product 4",
    //   image: "image4.jpg",
    //   price: 49.99,
    //   stock: 65,
    // },
    // {
    //   title: "Sample Product 5",
    //   image: "image5.jpg",
    //   price: 59.99,
    //   stock: 90,
    // },
    // {
    //   title: "Sample Product 6",
    //   image: "image6.jpg",
    //   price: 69.99,
    //   stock: 45,
    // },
    // {
    //   title: "Sample Product 7",
    //   image: "image7.jpg",
    //   price: 79.99,
    //   stock: 110,
    // },
    // {
    //   title: "Sample Product 8",
    //   image: "image8.jpg",
    //   price: 89.99,
    //   stock: 75,
    // },
    // {
    //   title: "Sample Product 9",
    //   image: "image9.jpg",
    //   price: 99.99,
    //   stock: 50,
    // },
    // {
    //   title: "Sample Product 10",
    //   image: "image10.jpg",
    //   price: 109.99,
    //   stock: 95,
    // },
  ];

  const products = await getAllProducts();

  if (products.length === 0) {
    await productModel.insertMany(initialProducts);
  }
};
