/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC, type PropsWithChildren, useEffect, useState } from "react";
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

  useEffect(() => {
    if (!token) return;
    const fetchCart = async () => {
      const respons = await fetch(`${beasURL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!respons.ok) {
        setError("failed to fetch a user cart");
      }

      const cart = await respons.json();
      const cartItemsMapped = cart.items.map(
        ({ product, quantity, unitPrice }: any) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        }),
      );

      setCartItems([...cartItemsMapped]);
      setTotlaAmount(cart.totalAmount);

    };

    fetchCart();
  }, [token]);

  const addItemToCart = async (productId: string) => {
    try {
      const respons = await fetch(`${beasURL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
