import { Container, Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        mt: 5,
      }}
      fixed
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        gap={3}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 100,
            color: "success.main",
          }}
        />

        <Typography variant="h3" fontWeight="bold" textAlign="center">
          Order Placed Successfully!
        </Typography>

        <Typography variant="h6" color="textSecondary" textAlign="center">
          Thank you for your purchase, your order will be delivered soon
        </Typography>

        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 3,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body1" color="textSecondary" mb={1}>
            Your order number has been sent to your email
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Check your email for shipping details
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            size="large"
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderSuccessPage;
