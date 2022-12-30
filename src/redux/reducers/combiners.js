import { combineReducers } from "redux";
import {ShoppingReducers} from './ShoppingReducers'
import { loginReducer } from "./LoginReducer";


export const totalReducers = combineReducers({
  ShoppingReducers,
  loginReducer
})