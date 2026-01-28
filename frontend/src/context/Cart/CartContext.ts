import { createContext, useContext } from "react";
import type { CartItem } from "../../typs/CartItem";

interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  addItemToCart: (productId: string) => void;
  upddateItemCart: (productId: string, quantity: number) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  addItemToCart: () => {},
  upddateItemCart: () => {},
});

export const useCart = () => useContext(CartContext);
