import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import userReducer from "../user";

export default history =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer
  });
