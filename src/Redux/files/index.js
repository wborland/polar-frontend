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
  fileList: [
    {
      storageName: "dfadslkfjsdalkfdjsldkfdsa.pdf",
      displayName: "Syllabus.pdf",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat, augue in venenatis semper, ante arcu facilisis orci, vel faucibus libero urna sit amet lorem. Nulla eget augue feugiat, imperdiet nibh ut, porta lectus. Ut aliquet justo at mollis finibus. Sed laoreet mi id lacus sodales lacinia. Ut fringilla sapien nec elit suscipit maximus. Integer rhoncus sem eu volutpat cursus. Vestibulum diam ipsum, pretium varius nisl a, auctor cursus orci. Sed finibus ut metus eget aliquam. Pellentesque nec tempor turpis. Etiam orci libero, semper convallis mi sed, facilisis sagittis neque. Nulla fringilla tempus quam laoreet vestibulum. Etiam quis nisl magna. Donec ultrices velit tincidunt arcu congue, ac rutrum leo posuere. Vivamus commodo, felis nec tempus molestie, enim velit rhoncus libero, ut congue nulla ligula in tortor. Donec commodo imperdiet nulla, ac dictum libero lacinia non.Phasellus dapibus purus a arcu ultrices, vitae laoreet leo facilisis.Donec id hendrerit nisl, et pharetra est.Duis tristique vulputate turpis nec varius.Mauris at felis lobortis, venenatis eros id, luctus turpis.In ac rutrum lectus, quis placerat ex.Etiam at placerat sapien.Interdum et malesuada fames ac ante ipsum primis in faucibus.Interdum et malesuada fames ac ante ipsum primis in faucibus.Nam nec dolor fermentum, commodo arcu eu, cursus leo.Phasellus placerat eros nec felis semper, non bibendum eros facilisis.Nam tempor iaculis metus, sodales eleifend ex tincidunt at.Morbi tristique, leo et luctus ornare, lorem ligula aliquam sem, a consequat justo velit at nulla.Donec eget mauris in ligula sagittis rhoncus.Curabitur lacinia ornare libero, sit amet bibendum nibh fringilla ut.",
      timestamp: "1582329605",
      userId: "1"
    }
  ]
};

// Action helpers
export const callGetFiles = auth => dispatch => {
  Axios.post("/files/getFiles", { auth: auth })
    .then(response => {
      if (response.status === 200) dispatch(getFiles(response.data));
      else {
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
      return { ...action.dialog };
    default:
      return state;
  }
};
export default fileReducer;
