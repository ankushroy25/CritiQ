/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import "../flow/config";
import { useNavigate } from "react-router-dom";
fcl.config();

const FlowContext = createContext();

export const FlowProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  const logIn = () => {
    fcl.authenticate();
    // setUser((user) => ({ ...user, isAdmin: true }));
    // console.log(user);
  };

  const logOut = () => {
    fcl.unauthenticate();
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const getProducts = async () => {
    // const products = await contract.call("getProducts");

    const products = await fetch("https://fakestoreapi.com/products").then(
      (res) => res.json()
    );
    const parsedCampaings = products.map((product, i) => ({
      pId: i,
      price: product.price,
      title: product.title,
      description: product.description,
      image: product.image,
      rating: product.rating,
    }));
    return parsedCampaings;
  };
  return (
    <FlowContext.Provider value={{ user, logIn, logOut, getProducts }}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlowAuth = () => useContext(FlowContext);
