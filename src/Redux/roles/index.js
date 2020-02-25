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
  listRoles: [
    {
      key: "1",
      roleName: "Role 1",
      permissions: "Permission 1, Permission 2"
    },
    {
      key: "2",
      roleName: "Role 2",
      permissions: "Permission 3, Permission 4"
    }
  ]
};

// Action helpers
export const updateFilterList = list => dispatch => {
  dispatch(updateRoleFilter(list));
};

export const deleteRole = roleId => dispatch => {
  axios.post("/iam/deleteRole", {
    roleId: roleId
  }).then(response => {
    if (response.status === 200) {
      dispatch({
        type: UPDATE_DIALOG,
        dialog: { open: false, object: { title: "", content: null } }
      });
    } else {
      message.error("Unable to delete role", 5);
      getRoleList();
    }
  });
};

export const addRole = data => dispatch => {
  axios.post("/iam/createRole", data)
    .then(response => {
      console.log("created role", response);
      dispatch({
        type: UPDATE_DIALOG,
        dialog: { open: false, object: { title: "", content: null } }
      });
    }).catch(err => {
      console.log(err.message);
      message.error("Failed to create role");
    })
}

export const getRoleList = (user) => dispatch => {
  axios.post("/iam/getRoles", {auth: user})
    .then(response => {
      console.log(response)
      if (response.status === 200) dispatch(roleList(response.data));
      else message.error("Unable to get list of roles", 5);
    })
    .catch(err => message.error("Unable to get list of roles", 5));
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
