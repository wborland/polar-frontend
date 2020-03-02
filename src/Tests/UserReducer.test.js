import userReducer from "../Redux/user";
import {
  LOGIN_USER,
  LOGOUT_USER,
  GET_USER,
  REGISTER_USER,
  UPDATE_DIALOG,
  RESET_PASSWORD
} from "../Redux/action_types";

// Blank user state
const blankState = {
  auth: "",
  firstName: "",
  lastName: "",
  permissions: "",
  isSignedIn: false
};
// Fake User 1
const userJSON = {
  auth: "767vHJGHJFVdehfv67w34",
  firstName: "FName",
  lastName: "LName",
  permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};
// Fake User 2
const userJSON2 = {
  auth: "78456478tjbfdfhr3489",
  firstName: "FirstName",
  lastName: "LastName",
  isSignedIn: false,
  permissions: [1, 5, 6, 7, 8, 9, 10, 11]
};

describe("userReducer", () => {
  
  // Initial State of User Reducer
  it("Return initial state", () => {
    expect(userReducer(undefined, {})).toEqual({
      auth: localStorage.token || "",
      firstName: "",
      lastName: "",
      permissions: "",
      isSignedIn: false
    });
  });

  // Login User
  it("User Login", () => {
    expect(
      userReducer(
        {},
        {
          type: LOGIN_USER,
          user: userJSON
        }
      )
    ).toEqual(userJSON);
  });

  // Logout User
  it("User Logout", () => {
    expect(userReducer(userJSON, {
      type: LOGOUT_USER
    })).toEqual(blankState);
  });

  // Register User
  it("User Register", () => {
    expect(
      userReducer(
        {},
        {
          type: REGISTER_USER,
          user: userJSON
        }
      )
    ).toEqual(userJSON);
  });

});
