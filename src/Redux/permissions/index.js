import {
  GET_ALL_PERMISSIONS
} from "../action_types";
import React from "react";
import { Button } from "antd";
import axios from "axios";
import { message } from "antd";
import { push } from "connected-react-router";

// Action creators
const getAllPerms = permissions => ({
  type: GET_ALL_PERMISSIONS,
  permissions
});


// Action helpers
export const getPermissions = () => dispatch => {
  return axios
    .post("/iam/permissions")
    .then(response => {
      console.log("Permissions", response);
      dispatch(getAllPerms(response.data));
    })
    .catch(err => {
      console.error("Failed to get permissions", err)
    });
};

// Blank user state
const blankState = {};

const permissionsReducer = (state = blankState, action) => {
  console.log("Action", action)
  switch (action.type) {
    case GET_ALL_PERMISSIONS:
      return { ...action.permissions};
    default:
      return state;
  }
};

export default permissionsReducer;
