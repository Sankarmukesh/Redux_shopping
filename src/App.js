import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import axios from "axios";


import Navbar from "./components/navbar/Navbar";
import Home from "./components/products/Home";
import Login from "./components/login/Login";
import { useDispatch, useSelector } from "react-redux";
import ProductsList from './components/products/ProductsList'
import Carts from "./components/products/Carts";
import Orders from "./components/products/Orders";
import SingleProduct from "./components/products/SingleProduct";
import { AllProducts } from "./redux/actions/CartActions";
function App() {
  const data = useSelector((state) => state.loginReducer.logined);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "CHECK" });
  }, [dispatch]);

  useEffect(() => {
    dispatch(AllProducts());
  }, [dispatch]);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: "10px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {data === false ? (
              <Route path="login" element={<Login />} />
            ) : (
              <Route path="/" element={<Home />} />
            )}
            {data === true ? (
              <>
                <Route path="products" element={<ProductsList />} />
                <Route path="cart" element={<Carts />} />
                <Route path="orders" element={<Orders />} />
                <Route path="product/:id" element={<SingleProduct />} />
               
              </>
            ) : (
              <Route path="/" element={<Home />} />
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
