import axios from 'axios';
import { LOGIN_USER, LOGOUT_USER, REGISTER_USER } from "../action_types";

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

export const userRegister = user => dispatch => {
  return axios.post('/user/register', user)
    .then(response => {
      console.log("Registration Successful");
      // Set auth token
      localStorage.setItem("user", response.data.auth);
      // Set isSignedIn
      response.data.isSignedIn = true;
      dispatch(registerUser(response.data));
      dispatch(push('/'));
    })
    .catch(err => {
      message.error("Registration Failed");
    });
}

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
    case REGISTER_USER:
      return {...action.user};
    default:
      return state;
  }
};
export default userReducer;
