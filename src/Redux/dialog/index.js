import { UPDATE_DIALOG } from "../action_types";

// Action creators
const openDialog = dialog => ({
  type: UPDATE_DIALOG,
  dialog
});

// Initial dialog state
const initialState = {
  open: false,
  object: {
    title: "",
    content: null
  }
};

// Action helpers
export const updateDialog = (open, object) => dispatch => {
  console.log(open);
  const dialog = object == null ? initialState.object : object;
  dispatch(openDialog({ open, object: dialog }));
};

const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DIALOG:
      return { ...action.dialog };
    default:
      return state;
  }
};
export default dialogReducer;
