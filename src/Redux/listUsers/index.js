import {
  GET_LIST_USERS,
  UPDATE_FILTER_LIST,
  SET_OTHER_USER
} from "../action_types";
import Axios from "axios";
import { message } from "antd";

// Action creators
const saveUserList = list => ({
  type: GET_LIST_USERS,
  list
});

const setOtherUser = user => ({
  type: SET_OTHER_USER,
  user
});

// Initial dialog state
const initialState = {
  listUsers: [],
  showUsers: [],
  currFilter: [],
  specificUser: null
};

// Action helpers
export const getUserList = auth => dispatch => {
  Axios.post("/iam/getUserRoles", { auth })
    .then(response => {
      if (response.status === 200) dispatch(saveUserList(response.data));
      else message.error("Something went wrong, please try again", 5);
    })
    .catch(reason => {
      message.error("Something went wrong, please try again", 5);
    });
};

export const getSpecificUser = userId => dispatch => {
  dispatch(setOtherUser(userId));

};

const filterUsers = (state, action) => {
  let tempUsers = [];
  for (let i in state.listUsers) {
    let currUser = state.listUsers[i];
    let tempBool = true;
    for (let j in action) {
      let currFilter = action[j];
      if (!currUser.roles.includes(currFilter.key)) {
        tempBool = false;
      }
    }
    if (tempBool) {
      tempUsers.push(currUser);
    }
  }
  return tempUsers;
};

export const assignRole = (auth, roleId, userId) => dispatch => {
  Axios.post("/iam/assignRole", { auth, roleId, userId })
    .then(response => {
      if (response.status === 200) {
        message.success("Role added to user successfully");
      } else {
        message.error("Role unable to be added to user, try again");
      }
    })
    .catch(reason =>
      message.error("Role unable to be added to user, try again")
    );
};

export const revokeRole = (auth, roleId, userId) => dispatch => {
  Axios.post("/iam/revokeRole", { auth, roleId, userId })
    .then(response => {
      if (response.status === 200) {
        message.success("Role revoked from user successfully");
      } else {
        message.error("Role unable to be revoked from user, try again");
      }
    })
    .catch(reason =>
      message.error("Role unable to be revoked from user, try again")
    );
};

const userListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST_USERS:
      if (state.currFilter.length !== 0) {
        return Object.assign({}, state, {
          listUsers: action.list,
          showUsers: filterUsers(state, state.currFilter)
        });
      }
      return Object.assign({}, state, {
        listUsers: action.list,
        showUsers: action.list
      });
    case UPDATE_FILTER_LIST:
      return Object.assign({}, state, {
        showUsers: filterUsers(state, action.filter),
        currFilter: action.filter
      });
    case SET_OTHER_USER:
      for (let i in state.listUsers) {
        if (action.user === state.listUsers[i].key) {
          return Object.assign({}, state, { specificUser: state.listUsers[i] });
        }
      }
      message.error("Unable to find user", 5);
      return state;
    default:
      return state;
  }
};
export default userListReducer;
