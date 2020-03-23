import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import userReducer from "../user";
import dialogReducer from "../dialog";
import permissionsReducer from "../permissions";
import roleReducer from "../roles";
import userListReducer from "../listUsers";
import fileReducer from "../files";

export default history =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer,
    dialog: dialogReducer,
    permissions: permissionsReducer,
    userList: userListReducer,
    roles: roleReducer,
    files: fileReducer
  });
