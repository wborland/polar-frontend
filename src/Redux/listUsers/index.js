import { GET_LIST_USERS, UPDATE_FILTER_LIST } from "../action_types";
import Axios from "axios";
import { message } from "antd";

// Action creators
const saveUserList = list => ({
  type: GET_LIST_USERS,
  list
});

// Initial dialog state
const initialState = {
  listUsers: [
    {
      key: "321651",
      firstName: "Johnny",
      lastName: "Cage",
      phone: "11879451",
      email: "sbeve@polarapp.xyz",
      roles: ["12", "4"]
    }
  ],
  showUsers: [
    {
      key: "321651",
      firstName: "Johnny",
      lastName: "Cage",
      phone: "11879451",
      email: "sbeve@polarapp.xyz",
      roles: ["12", "4"]
    }
  ],
  currFilter: []
};

// Action helpers
export const getUserList = () => dispatch => {
  Axios.post("localhost:5000/iam/getUserList", {})
    .then(response => {
      if (response.status === 200) dispatch(saveUserList(response.data));
      else message.error("Something went wrong, please try again", 5);
    })
    .catch(reason => {
      message.error("Something went wrong, please try again", 5);
    });
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
    default:
      return state;
  }
};
export default userListReducer;
