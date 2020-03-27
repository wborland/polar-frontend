import { GET_ALL_FILES, UPDATE_DIALOG } from "../action_types";
import Axios from "axios";
import { message } from "antd";

// Action creators
const getFiles = fileList => ({
  type: GET_ALL_FILES,
  fileList
});

// Initial dialog state
const initialState = {
  fileList: []
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

export const deleteFiles = (auth, fileName) => dispatch => {
  Axios.post("/files/delete", { auth, fileName })
    .then(response => {
      if (response.status === 200)
        dispatch({
          type: UPDATE_DIALOG,
          dialog: { open: false, object: { title: "", content: null } }
        });
      else {
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
      return { ...action };
    default:
      return state;
  }
};
export default fileReducer;
