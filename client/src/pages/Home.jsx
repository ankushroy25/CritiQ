import { useState, useEffect } from "react";

import { DisplayProducts } from "../components";
import { useStateAuth } from "../context/StateProvider";
const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const { fetchProducts } = useStateAuth();

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts();
      if (data.length > 0) setProducts(data);

      setIsLoading(false);
    };
    getProducts();
  }, [fetchProducts]);

  return (
    <DisplayProducts
      title="All Products"
      isLoading={isLoading}
      products={products}
    />
  );
};

export default Home;
