import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import type { Product } from "../typs/product";
import { Box } from "@mui/material";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();
        setProducts(data);
      } catch {
        setError(true);
      }
    };

    fetchData();
  }, []);
  if (error) return <Box>sonthing went wrong</Box>;

  return (
    <Container
      sx={{
        mt: 2,
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {products.map((p: Product) => {
          return (
            <Grid size={4}>
              <ProductCard {...p} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default HomePage;
