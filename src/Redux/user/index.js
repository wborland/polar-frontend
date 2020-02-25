import {
  LOGIN_USER,
  LOGOUT_USER,
  GET_USER,
  UPDATE_DIALOG
} from "../action_types";
import axios from "axios";
import { message } from "antd";
import { push } from "connected-react-router";

// Action creators
const loginUser = user => ({
  type: LOGIN_USER,
  user
});
const logoutUser = () => ({
  type: LOGOUT_USER
});

const getUser = user => ({
  type: GET_USER,
  user
});

// Action helpers
export const userLogin = user => dispatch => {
  return axios
    .post("/user/login", user)
    .then(response => {
      console.log("Login Successful");
      // Set auth token
      localStorage.setItem("user", response.data.auth);
      // Set isSignedIn
      response.data.isSignedIn = true;
      dispatch(loginUser(response.data));
      dispatch(push("/"));
    })
    .catch(err => {
      message.error("Invalid Login");
    });
};

export const userLogout = () => dispatch => {
  localStorage.removeItem("token");
  dispatch(logoutUser());
  dispatch(push("/login"));
  message.success("Deleted user account successfully", 5);
};

/* export const userCheckToken = () => dispatch => {
  const token = localStorage.token;
  if (token) {
    return fetch(`${URL}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.id) {
          // The user token is valid
          dispatch(
            loginUser({
              ...data,
              token
            })
          );
        } else {
          // The user token is invalid
          dispatch(userLogout());
        }
      });
  }
}; */

export const deleteUser = auth => dispatch => {
  axios
    .post("/user/delete", { auth })
    .then(response => {
      if (response.status !== 200) {
        message.error("Unable to delete account, please try again", 10);
      } else {
        closeModal(dispatch);
        dispatch(logoutUser());
        dispatch(push("/login"));
      }
    })
    .catch(response =>
      message.error("Something happened, please try again", 5)
    );
  dispatch(logoutUser());
};

export const getUserInfo = auth => dispatch => {
  axios
    .post("/user/getInfo", { auth: auth })
    .then(response => {
      if (response.status !== 200) {
        message.error("Unable to get user information, please try again", 10);
      } else {
        dispatch(getUser(response.data));
      }
    })
    .catch(response =>
      message.error("Something happened, please try again", 5)
    );
};

const closeModal = dispatch => {
  dispatch({
    type: UPDATE_DIALOG,
    dialog: { open: false, object: { title: "", content: null } }
  });
};

export const setUserInfo = info => dispatch => {
  axios
    .post("/user/setInfo", info)
    .then(response => {
      if (response.status !== 200) {
        message.error("Unable to set user information, please try again", 10);
      } else {
        closeModal(dispatch);
      }
    })
    .catch(response =>
      message.error("Something happened, please try again", 5)
    );
};

// Initial user state
const initialState = {
  auth: localStorage.token || "",
  firstName: "",
  lastName: "",
  permissions: "",
  isSignedIn: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...action.user };
    case LOGOUT_USER:
      return { ...initialState };
    case GET_USER:
      return Object.assign({}, state, { ...action.user });
    default:
      return state;
  }
};

export default userReducer;
