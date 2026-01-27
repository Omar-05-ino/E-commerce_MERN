import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { beasURL } from "../constantes/beasURL";
import { useAuth } from "../context/Auth/AuthContext";

const CartPage = () => {
  const [cart, setCart] = useState();
  const [error, setError] = useState<string>("");
  const { token } = useAuth();

  console.log(error);

  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchCart = async () => {
      const response = await fetch(`${beasURL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to fatch user cart. please try again");
      }

      const data = await response.json();
      setCart(data);
    };

    fetchCart();
  }, [token]);

  console.log(cart);
  return (
    <Container
      sx={{
        mt: 2,
      }}
    >
      <Typography variant="h4">my cart</Typography>
    </Container>
  );
};

export default CartPage;
