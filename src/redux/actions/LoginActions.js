import axios from "axios";
import jwtDecode from "jwt-decode";

export const LoginUser = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
  return { type: "LOGIN", payload: jwtDecode(data) };
};

export const LogoutUser = () => {
  if (localStorage.getItem("user")) {
    localStorage.removeItem("user");
  }
  return {
    type: "LOGOUT",
  };
};
