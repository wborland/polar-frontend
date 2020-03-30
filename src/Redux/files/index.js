import { GET_ALL_FILES, UPDATE_DIALOG, OPEN_FILE } from "../action_types";
import Axios from "axios";
import { message } from "antd";

// Action creators
const getFiles = fileList => ({
  type: GET_ALL_FILES,
  fileList
});

// Initial dialog state
const initialState = {
  fileList: [],
  open: {}
};

// Action helpers
export const callGetFiles = auth => dispatch => {
  Axios.post("/files/view", { auth: auth })
    .then(response => {
      if (response.status === 200) {
        let newArr = response.data.map((val, index) => {
          return {
            fileId: val[0],
            storageName: val[1],
            displayName: val[2],
            description: val[3],
            userId: val[4],
            uploaderName: val[5] + " " + val[6],
            key: val[0]
          };
        });
        dispatch(getFiles(newArr));
      } else {
        message.error(
          "Something went wrong, please reload the page to try again",
          10
        );
      }
    })
    .catch(err => {
      message.error(
        "Something went wrong, please reload the page to try again",
        10
      );
    });
};

export const openFile = (auth, name, displayName) => dispatch => {
  Axios.post("/files/download", { auth, name }, { responseType: "arraybuffer" })
    .then(response => {
      if (response.status === 200) {
        dispatch({ type: OPEN_FILE, open: response.data });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", displayName);
        link.click();
      } else {
        message.error(
          "Something went wrong, please reload the page to try again",
          10
        );
      }
    })
    .catch(err => {
      message.error(
        "Something went wrong, please reload the page to try again",
        10
      );
    });
};

export const uploadFile = (body, auth) => dispatch => {
  Axios.post("/files/upload", body, {
    headers: { auth: auth }
  })
    .then(response => {
      console.log(response.status);
      if (response.status === 200) {
        message.success("Successfully added file, please refresh the page");
        dispatch({
          type: UPDATE_DIALOG,
          dialog: { open: false, object: { title: "", content: null } }
        });
      } else {
        message.error("Something went wrong, please try again", 10);
      }
    })
    .catch(err => {
      if (
        err.response.data.message === "A file with this name already exists."
      ) {
        message.error(
          "A file with this display name already exists, please change display name.",
          10
        );
      } else {
        message.error("Something went wrong, please try again", 10);
      }
    });
};

export const deleteFiles = (auth, fileId, name) => dispatch => {
  Axios.post("/files/delete", { auth, fileId, name })
    .then(response => {
      if (response.status === 200) {
        dispatch({
          type: UPDATE_DIALOG,
          dialog: { open: false, object: { title: "", content: null } }
        });
        message.success(
          "File deleted successfully, refresh page to see changes",
          5
        );
      } else {
        message.error("Something went wrong, please try again", 10);
      }
    })
    .catch(err => {
      message.error("Something went wrong, please try again", 10);
    });
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_FILES:
      return Object.assign({}, state, { fileList: action.fileList });
    case OPEN_FILE:
      return Object.assign({}, state, { open: action.open });
    default:
      return state;
  }
};
export default fileReducer;
