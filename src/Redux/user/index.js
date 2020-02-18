import {
  LOGIN_USER,
  LOGOUT_USER,
  GET_USER,
  UPDATE_DIALOG
} from "../action_types";
import React from "react";
import { Button } from "antd";

import axios from "axios";
import { updateDialog } from "../dialog";

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
  return fetch(`localhost:5000/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      user: {
        ...user
      }
    })
  })
    .then(resp => resp.json())
    .then(data => {
      console.log(data);

      if (data.errors) {
        // TODO: Actually show a dialog here for the errors
        alert(JSON.stringify(data.errors));
      } else {
        localStorage.setItem("token", data.user.token);
        dispatch(loginUser(data.user));
      }
    });
};

export const userLogout = () => dispatch => {
  localStorage.removeItem("token");
  dispatch(logoutUser());
};

export const userCheckToken = () => dispatch => {
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
};

export const deleteUser = auth => dispatch => {
  axios
    .post("http://localhost:5000/user/delete", { auth: auth })
    .then(response => {
      if (response.status !== 200) {
        dispatch({
          type: UPDATE_DIALOG,
          dialog: {
            open: true,
            object: {
              title: "Delete Account",
              content: (
                <div>
                  <p>Unable to delete account, please try again</p>
                  <Button onClick={() => closeModal(dispatch)}>Ok</Button>
                </div>
              )
            }
          }
        });
      } else {
        closeModal(dispatch);
      }
    });
  dispatch(logoutUser());
};

export const getUserInfo = auth => dispatch => {
  axios
    .post("http://localhost:5000/user/getInfo", { auth: auth })
    .then(response => {
      if (response.status !== 200) {
        dispatch({
          type: UPDATE_DIALOG,
          dialog: {
            open: true,
            object: {
              title: "Change Account Information",
              content: (
                <div>
                  <p>Unable to get user information</p>
                  <Button onClick={() => closeModal(dispatch)}>Ok</Button>
                </div>
              )
            }
          }
        });
      } else {
        dispatch(getUser(response.data));
      }
    });
};

const closeModal = dispatch => {
  dispatch({
    type: UPDATE_DIALOG,
    dialog: { open: false, object: { title: "", content: null } }
  });
};

export const setUserInfo = info => dispatch => {
  axios.post("http://localhost:5000/user/setInfo", info).then(response => {
    if (response.status !== 200) {
      dispatch({
        type: UPDATE_DIALOG,
        dialog: {
          open: true,
          object: {
            title: "Change Account Information",
            content: (
              <div>
                <p>Unable to set user information, please try again</p>
                <Button onClick={() => closeModal(dispatch)}>Ok</Button>
              </div>
            )
          }
        }
      });
    } else {
      closeModal(dispatch);
    }
  });
};

// Initial user state
const initialState = {
  id: null,
  email: "",
  isSignedIn: false,
  token: localStorage.token || ""
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
