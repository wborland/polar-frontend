import { GET_ROLES, UPDATE_FILTER_LIST, UPDATE_DIALOG } from "../action_types";
import axios from "axios";
import { message } from "antd";

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
  listRoles: []
};

// Action helpers
export const updateFilterList = list => dispatch => {
  dispatch(updateRoleFilter(list));
};

export const deleteRole = data => dispatch => {
  axios.post("/iam/removeRole", data)
    .then(response => {
      dispatch({
        type: UPDATE_DIALOG,
        dialog: { open: false, object: { title: "", content: null } }
      });
      getRoleList();
    }).catch((err) => {
      message.error("Unable to delete role");
    });
};

export const addRole = data => dispatch => {
  axios.post("/iam/createRole", data)
    .then(response => {
      dispatch({
        type: UPDATE_DIALOG,
        dialog: { open: false, object: { title: "", content: null } }
      });
    }).catch(err => {
      message.error("Failed to create role");
    })
}

export const getRoleList = (user) => dispatch => {
  axios.post("/iam/getRoles", {auth: user})
    .then(response => {
      if (response.status === 200) dispatch(roleList(response.data));
      else message.error("Unable to get list of roles", 5);
    })
    .catch(reason => {
      message.error("Unable to get list of roles", 5);
    });
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLES:
      return Object.assign({}, state, { listRoles: action.list });
    default:
      return state;
  }
};
export default roleReducer;
