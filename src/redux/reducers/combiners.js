import { combineReducers } from "redux";
import { TodoReducers } from "./TodoReducers";
import { loginReducer } from "./LoginReducer";


export const totalReducers = combineReducers({
  TodoReducers,
  loginReducer
})