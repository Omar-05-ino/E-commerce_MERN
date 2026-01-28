import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useCart } from "../context/Cart/CartContext";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const CartPage = () => {
  const { cartItems ,totalAmount} = useCart();
  const [error] = useState<string>("");

  console.log(error);

  return (
    <Container
      sx={{
        mt: 1,
      }}
      fixed
    >
      <Typography variant="h4" mb={1}>my cart</Typography>
      <Box display="flex" flexDirection='column'   gap={1}>
        {cartItems.map((item) => (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              border: 1,
              borderColor: "#f3f3f3",
              borderRadius:5,
              padding:2
            }}
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={1}
              mb={1}
            >
              <img src={item.image} alt={item.title} width={150} />
              <Box>
                <Typography variant="h5">{item.title}</Typography>
                <Typography mb={1}>
                  {" "}
                  {item.quantity} X {item.unitPrice} $
                </Typography>
                <Button>Remov</Button>
              </Box>
            </Box>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button>-</Button>
              <Button>+</Button>
            </ButtonGroup>
          </Box>
        ))}

        <Box><Typography>Totla Amount : {totalAmount} $</Typography></Box>
      </Box>
    </Container>
  );
};

export default CartPage;
