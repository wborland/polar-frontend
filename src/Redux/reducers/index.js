import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import userReducer from "../user";
import dialogReducer from "../dialog";
import roleReducer from "../roles";
import userListReducer from "../listUsers";

export default history =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer,
    dialog: dialogReducer,
    userList: userListReducer,
    roles: roleReducer
  });
