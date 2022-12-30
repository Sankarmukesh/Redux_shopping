import jwtDecode from "jwt-decode";
const intialState = {
  logined: false,
  userData: {},
};

export const loginReducer = (state = intialState, actions) => {
  switch (actions.type) {
    case "CHECK":
      if (localStorage.getItem("user")) {
        return {
          ...state,
          logined: true,
          userData: jwtDecode(JSON.parse(localStorage.getItem("user"))),
        };
      }
      return state;

    case "LOGIN":
      return { ...state, logined: true,userData:actions.payload };
    case "LOGOUT":
      return { ...state, logined: false,userData:{} };
    default:
      return state;
  }
};
