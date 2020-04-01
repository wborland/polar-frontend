import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import userReducer from "../user";
import dialogReducer from "../dialog";
import permissionsReducer from "../permissions";
import roleReducer from "../roles";
import userListReducer from "../listUsers";
import tableListReducer from "../tables";

export default history =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer,
    dialog: dialogReducer,
    permissions: permissionsReducer,
    userList: userListReducer,
    roles: roleReducer,
    tables: tableListReducer 
  });