import {
  LOGIN_USER,
  LOGOUT_USER,
  GET_USER,
  REGISTER_USER,
  UPDATE_DIALOG,
  RESET_PASSWORD
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
const registerUser = user => ({
  type: REGISTER_USER,
  user
});

const getUser = user => ({
  type: GET_USER,
  user
});
const passwordReset = user => ({
  type: RESET_PASSWORD,
  user
});
// Action helpers
export const userLogin = user => dispatch => {
  return axios
    .post("/user/login", user)
    .then(response => {
      // Set auth token
      localStorage.setItem("token", response.data.auth);
      // Set isSignedIn
      response.data.isSignedIn = true;
      dispatch(loginUser(response.data));
      dispatch(push("/"));
    })
    .catch(err => {
      console.log(err.response);
      message.error("Invalid Login");
    });
};

export const userLogout = () => dispatch => {
  localStorage.removeItem("token");
  dispatch(logoutUser());
  dispatch(push("/login"));
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
    .post("/user/delete", { auth: auth })
    .then(response => {
      if (response.status !== 200) {
        message.error("Unable to delete account, please try again", 10);
      } else {
        localStorage.removeItem("token");
        closeModal(dispatch);
        message.success("Deleted user account successfully", 5);
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
  console.log("Getting user info");
  axios
    .post("/user/getInfo", { auth: auth })
    .then(response => {
      if (response.status == 401) {
        dispatch(push("/login"));
      } else if (response.status !== 200) {
        message.error("Unable to get user information, please try again", 10);
      } else {
        response.data.isSignedIn = true;
        dispatch(getUser(response.data));
      }
    })
    .catch(err => {
      if (err.response.status == 401) {
        closeModal(dispatch);
        localStorage.removeItem("token");
        dispatch(logoutUser());
        dispatch(push("/login"));
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

export const userRegister = user => dispatch => {
  if (user.token) {
    return axios
      .post("/user/registerEmail", user)
      .then(response => {
        // Set auth token
        localStorage.setItem("token", response.data.auth);
        // Set isSignedIn
        response.data.isSignedIn = true;
        dispatch(registerUser(response.data));
        dispatch(push("/"));
      })
      .catch(err => {
        message.error("Registration Failed: " + err.response.data.message);
      });
  } else {
    return axios
      .post("/user/register", user)
      .then(response => {
        // Set auth token
        localStorage.setItem("token", response.data.auth);
        // Set isSignedIn
        response.data.isSignedIn = true;
        dispatch(registerUser(response.data));
        dispatch(push("/"));
      })
      .catch(err => {
        message.error("Registration Failed: " + err.response.data.message);
      });
  }
};

export const resetPassword = user => dispatch => {
  return axios
    .post("/user/resetPassword", user)
    .then(response => {
      message.success("Password reset successfully");
      dispatch(push("/login"));
    })
    .catch(err => {
      message.error("Failed to reset password");
    });
};

export const inviteUser = data => dispatch => {
  axios
    .post("/iam/inviteUser", data)
    .then(response => {
      message.success("Invite Email sent to New User");
      dispatch({
        type: UPDATE_DIALOG,
        dialog: { open: false, object: { title: "", content: null } }
      });
    })
    .catch(err => {
      message.error("Failed to invite user");
    });
};

// Initial user state
const initialState = {
  auth: localStorage.token || "",
  firstName: "",
  lastName: "",
  permissions: "",
  isSignedIn: false
};

// Blank user state
const blankState = {
  auth: "",
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
      return { ...blankState };
    case REGISTER_USER:
      return { ...action.user };
    case GET_USER:
      return Object.assign({}, state, { ...action.user });
    default:
      return state;
  }
};

export default userReducer;
