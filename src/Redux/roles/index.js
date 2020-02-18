import { GET_ROLES, UPDATE_FILTER_LIST } from "../action_types";
import Axios from "axios";

// Action creators
const updateRoleFilter = filter => ({
  type: UPDATE_FILTER_LIST,
  filter
});

const roleList = list => ({
  type: GET_ROLES,
  list
});

// Initial dialog state
const initialState = {
  listRoles: [
    {
      key: "1",
      rolename: "Role 1",
      permissions: "Permission 1, Permission 2"
    },
    {
      key: "2",
      rolename: "Role 2",
      permissions: "Permission 3, Permission 4"
    }
  ],
  filterList: []
};

// Action helpers
export const updateFilterList = list => dispatch => {
  dispatch(updateRoleFilter(list));
};

export const getRoleList = () => dispatch => {
  Axios.post("http://localhost:5000/iam/getRoles", {}).then(response => {
    dispatch(roleList(response.data));
  });
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLES:
      return Object.assign({}, state, { listRoles: action.list });
    case UPDATE_FILTER_LIST:
      return Object.assign({}, state, { filterList: action.filter });
    default:
      return state;
  }
};
export default roleReducer;
