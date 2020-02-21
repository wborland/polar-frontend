import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import userReducer from "../user";
import dialogReducer from "../dialog";
import permissionsReducer from "../permissions";

export default history =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer,
    dialog: dialogReducer,
    permissions: permissionsReducer
  });
