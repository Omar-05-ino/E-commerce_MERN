import { useEffect } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import type { Order } from "../typs/order";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MyOrders = () => {
  const { getMyOrders, orders } = useAuth() as {
    getMyOrders: () => void;
    orders: Order[] | undefined;
  };

  useEffect(() => {
    getMyOrders();
  }, [orders]);

  return (
    <Container
      sx={{
        mt: 3,
        mb: 3,
      }}
      fixed
    >
      <Typography variant="h4" mb={3} fontWeight="bold">
        My Orders
      </Typography>

      {orders && orders.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Order ID: {order._id}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="success.main"
                    fontWeight="bold"
                  >
                    ${order.totalAmount}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" mb={2}>
                  Address: {order.address}
                </Typography>

                {order.orderItems && order.orderItems.length > 0 ? (
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="center">Unit Price</TableCell>
                          <TableCell align="center">Quantity</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={2}>
                                <img
                                  src={item.productImage}
                                  alt={item.productTitle}
                                  width={60}
                                  height={60}
                                  style={{ objectFit: "cover" }}
                                />
                                <Typography variant="body2">
                                  {item.productTitle}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              ${item.unitPrice}
                            </TableCell>
                            <TableCell align="center">
                              {item.quantity}
                            </TableCell>
                            <TableCell align="right">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No items in this order
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Typography variant="h6" color="textSecondary">
            No orders yet
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MyOrders;
