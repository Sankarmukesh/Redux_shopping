import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";

import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { LoginUser } from "../../redux/actions/LoginActions";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleCallback(response) {
    console.log("Encoded", jwt_decode(response.credential));
    dispatch(LoginUser(response.credential));
    navigate("/todos");
  }

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id:
        "942353902440-91vanr0b0bbsk2rspte5mrih9eurthh7.apps.googleusercontent.com",
      callback: handleCallback,
    });

    window.google.accounts.id.renderButton(document.getElementById("signIn"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <div>
      <main class="main">
        <div class="container">
          <section class="wrapper">
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "28px",
              }}
            >
              Google Sign In
            </div>
            <div id="signIn" style={{ marginLeft: "90px" }}></div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;
