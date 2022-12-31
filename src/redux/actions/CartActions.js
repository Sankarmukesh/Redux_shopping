import axios from "axios";
import jwtDecode from "jwt-decode";
import { Backend_url } from "../../Config";

export const AllProducts = () => async (dispatch) => {
  await axios
    .get("https://react-shopping-cart-67954.firebaseio.com/products.json")
    .then((res) => {
      dispatch({ type: "ADD", payload: res.data.products });
    });
};

export const Singleproduct = (id) => async (dispatch) => {
  await axios
    .get("https://react-shopping-cart-67954.firebaseio.com/products.json")
    .then((res) => {
      res.data.products.map((r, i) => {
        if (r.id === +id) {
          dispatch({ type: "SingleProduct", payload: r });
        }
      });
    });
};

export const AllCart = () => async (dispatch) => {
  await axios.get(`${Backend_url}/cart`).then((res) => {
    const totalCarts = []
    res.data.map(r=>{
        if(r.email === jwtDecode(localStorage.getItem('user')).email){
            totalCarts.push(r)
        }
    })
    dispatch({ type: "CARTALL", payload:totalCarts });
  });
};

export const AllOrders = () => async (dispatch) => {
  await axios.get(`${Backend_url}/orders`).then((res) => {
    const totalOrders = []
    res.data.map(r=>{
        if(r.email === jwtDecode(localStorage.getItem('user')).email){
            totalOrders.push(r)
        }
    })
    dispatch({ type: "ORDERSALL", payload:totalOrders});
  });
};

export const AddCart = (data) => async (dispatch) => {
  await axios.post(`${Backend_url}/cart`, data).then((res) => {
    dispatch(AllCart());
  });
};


export const EditCart = (id,data) => async (dispatch) => {
    await axios.put(`${Backend_url}/cart/${id}`, data).then((res) => {
      dispatch(AllCart());
    });
  };

export const DeleteCart = (id) => async (dispatch) => {
  await axios.delete(`${Backend_url}/cart/${id}`).then((res) => {
    // dispatch({type:"CARTDELETE",payload:id})
    dispatch(AllCart());
  });
};

export const AddOrder = (data) => async (dispatch) => {
    // console.log(data);
  await axios.post(`${Backend_url}/orders`, data).then((res) => {
    dispatch(AllOrders());
  });
};


export const DeleteOrders = (id) => async (dispatch) => {
  await axios.delete(`${Backend_url}/orders/${id}`).then((res) => {
    // dispatch({type:"CARTDELETE",payload:id})
    dispatch(AllOrders());
  });
};