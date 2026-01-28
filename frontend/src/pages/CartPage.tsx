import { Box, Container, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const {
    cartItems,
    totalAmount,
    upddateItemCart,
    RemovItemFromCart,
    clearCart,
  } = useCart();

    const navigate = useNavigate();


  const handleQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    upddateItemCart(productId, quantity);
  };

  const handleRemovItem = (productId: string) => {
    RemovItemFromCart(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheck = () => {
    navigate("/checkout");
  };

  return (
    <Container
      sx={{
        mt: 1,
      }}
      fixed
    >
      <Typography variant="h4" mb={1}>
        my cart
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {cartItems.map((item) => (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              border: 1,
              borderColor: "#f3f3f3",
              borderRadius: 5,
              padding: 2,
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
                <Button onClick={() => handleRemovItem(item.productId)}>
                  Remov
                </Button>
              </Box>
            </Box>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button
                onClick={() =>
                  handleQuantity(item.productId, item.quantity - 1)
                }
              >
                -
              </Button>
              <Button
                onClick={() =>
                  handleQuantity(item.productId, item.quantity + 1)
                }
              >
                +
              </Button>
            </ButtonGroup>
          </Box>
        ))}

        <Box
          display={"flex"}
          justifyItems={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={3}
        >
          <Typography>Totla Amount : {totalAmount} $</Typography>
          <Button onClick={() => handleClearCart()}>Clear Cart</Button>
        </Box>
        <Button onClick={() => handleCheck()}>Go to check out</Button>
      </Box>
    </Container>
  );
};

export default CartPage;
