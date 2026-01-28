/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC, type PropsWithChildren, useState } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../typs/CartItem";
import { beasURL } from "../../constantes/beasURL";
import { useAuth } from "../Auth/AuthContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotlaAmount] = useState<number>(0);
  const [error, setError] = useState<string>();
  console.log(error);
  const addItemToCart = async (productId: string) => {
    try {
      const respons = await fetch(`${beasURL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" :`Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!respons.ok) {
        setError("failed to add to cart");
      }

      const cart = await respons.json();

      if (!cart) {
        setError("failed to prase cart data");
      }

      const cartItemsMapped = cart.items.map(({ product, quantity }: any) => ({
        productId: product._id,
        title: product.title,
        image: product.image,
        quantity,
        unitPrice: product.unitPrice,
      }));
      setCartItems([...cartItemsMapped]);
      setTotlaAmount(cart.totalAmount);
    } catch (erroe) {
      console.log(erroe);
    }
  };
  return (
    <CartContext.Provider value={{ cartItems, totalAmount, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
