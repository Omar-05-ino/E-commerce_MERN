import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useCart } from "../context/Cart/CartContext";

const CartPage = () => {
  const { cartItems } = useCart();
  const [error] = useState<string>("");

  console.log(error);

  return (
    <Container
      sx={{
        mt: 2,
      }}
    >
      <Typography variant="h4">my cart</Typography>
      {cartItems.map((item) => (
      
        <Box
          key={item.productId || item.title}
          sx={{ mb: 2, p: 2, border: "1px solid #ddd" }}
        >
          <Typography variant="h6">{item.title}</Typography>
          <Typography>Price: {item.unitPrice}</Typography>
          <Typography>Quantity: {item.quantity}</Typography>
        </Box>
      ))}
    </Container>
  );
};

export default CartPage;
