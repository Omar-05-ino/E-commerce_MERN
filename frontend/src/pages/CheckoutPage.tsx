import { Box, Container, TextField, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import { beasURL } from "../constantes/beasURL";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";

const CheckoutPage = () => {
  const { token } = useAuth();

  const { cartItems, totalAmount, clearCart } = useCart();
  const [error, setError] = useState<boolean>(true);
  const addressRef = useRef<HTMLInputElement>(null);
  const Navigate = useNavigate();

  const handleClearCart = () => {
    clearCart();
  };

  const handleBay = async () => {
    const address = addressRef.current?.value;
    if (!address) {
      setError(false);
      return;
    }
    setError(true);
    const respons = await fetch(`${beasURL}/cart/checkout`, {
      method: "POSt",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
      }),
    });

    if (!respons.ok) {
      console.log("not ok");
      return;
    }

    handleClearCart();

    Navigate("/order-success");
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
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={1}
              mb={1}
            >
              <Typography mb={1}>
                {item.quantity} X {item.unitPrice} $
              </Typography>
            </Box>
          </Box>
        ))}

        <Box
          display={"flex"}
          justifyItems={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={3}
          mb={2}
          mt={2}
        >
          <Typography variant="h6">Totla Amount : {totalAmount} $</Typography>
        </Box>

        <TextField
          inputRef={addressRef}
          label="Delivery address"
          name="adress"
        />
        {!error ? (
          <Box
            display={"flex"}
            justifyItems={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={3}
          >
            <Typography variant="h6" color="red">
              palse but your address
            </Typography>
          </Box>
        ) : (
          <></>
        )}

        <Button
          variant="contained"
          onClick={() => handleBay()}
          sx={{ marginTop: "5", marginBottom: "5" }}
        >
          Bay now
        </Button>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
