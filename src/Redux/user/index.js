import axios from 'axios';
import {message} from 'antd';
import { LOGIN_USER, LOGOUT_USER } from "../action_types";
import { push } from "connected-react-router";

// Action creators
const loginUser = user => ({
  type: LOGIN_USER,
  user
});
const logoutUser = () => ({
  type: LOGOUT_USER
});

// Action helpers
export const userLogin = (user) => dispatch => {
  return axios.post('/user/login', user)
    .then(response => {
      console.log("Login Successful");
      // Set auth token
      localStorage.setItem("user", response.data.auth);
      // Set isSignedIn
      response.data.isSignedIn = true;
      dispatch(loginUser(response.data));
      dispatch(push('/'));
    })
    .catch(err => {
      message.error("Invalid Login");
    });
  
};

export const userLogout = () => dispatch => {
  localStorage.removeItem("token");
  dispatch(logoutUser());
  dispatch(push('/login'))
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

// Initial user state
const initialState = {
  auth: localStorage.token || "",
  firstName: "",
  lastName: "",
  permissions: "",
  isSignedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...action.user };
    case LOGOUT_USER:
      return { ...initialState };
    default:
      return state;
  }
};

export default userReducer;
