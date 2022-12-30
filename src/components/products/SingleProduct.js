import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AddCart, AllProducts, Singleproduct } from "../../redux/actions/CartActions";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate= useNavigate()

  const singleproduct = useSelector(
    (state) => state.ShoppingReducers.singleProduct
  );
  const [singleDataCart, setSingleDataCart] = useState({});
  const [singleData, setSingleData] = useState({});

  const [totalItems, setTotalItems] = useState(1);
  const [size, setSize] = useState("");
  const [price,setPrice] = useState(0)

  useEffect(() => {
    setSingleData(singleproduct);
    setPrice(singleproduct.price)
    // console.log(singleproduct);
  }, [singleproduct]);
  useEffect(() => {
    dispatch(Singleproduct(id));
  }, [dispatch, id]);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{singleproduct.title}</h1>
      <div
        style={{
          padding: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              Description:
            </span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              {singleData.description}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              Installments:
            </span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              {" "}
              {singleData.installments}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              Shipping:
            </span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              {" "}
              {singleData.isFreeShipping === true ? "Free" : "Paid"}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>Style:</span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              {" "}
              {singleData.style}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>Sku:</span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              {" "}
              {singleData.sku}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>Price:</span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              {" "}
              {price}
              {singleData.currencyFormat}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              Available Sizes:
            </span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              <select
                style={{ width: "180px", padding: "10px" }}
                onChange={(e) => {
                  setSize(e.target.value);
                }}
              >
              <option selected hidden >Select Size</option>
                {singleData.availableSizes &&
                  singleData.availableSizes.map((a) => (
                    <option value={a}>{a}</option>
                  ))}
              </select>
            </span>
          </div>

          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              Select No.of Items:
            </span>{" "}
            <input
              type="number"
              
              style={{ padding: "5px" }}
              placeholder="Enter No.of items"
              onChange={(e) => {
                if (e.target.value < 1) {
                  window.alert("Enter value greater than 1");
                  e.target.value = "";
                  setTotalItems(1)
                  setPrice(singleData.price)
                }
                else{
                    setPrice(parseInt(e.target.value)*parseFloat(singleData.price))
                    setTotalItems(e.target.value)
                }
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            {size !== "" && totalItems > 0 ? (
              <button
                style={{
                  background: "#F1f3f4",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}

                onClick={e=>{
                    dispatch(AddCart({...singleData,TotalPrice:price,selectedSize:size,totalitems:+totalItems,email:jwtDecode(localStorage.getItem('user')).email}))
                    navigate('/cart')
                }}
              >
                Add to cart
              </button>
            ) : (
              <>
               
                <button
                  style={{
                    background: "#F1f3f4",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "not-allowed",
                  }}
                  onMouseOver={(e) => {
                    e.target.nextElementSibling.style.display = "block";
                  }}
                  onMouseLeave={(e) => {
                    e.target.nextElementSibling.style.display = "none";
                  }}
                >
                  Add to cart
                </button>
                <div
                  style={{
                    background: "red",
                    color: "white",
                    marginTop:"10px",
                    transition:"all ease 2s",
                    padding: "2px",
                    // position: "absolute",
                    bottom: "-35px",
                    right: "-250px",
                    display: "none",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    borderRadius: "2px",
                  }}
                >
                  Please Enter Total number and size
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
