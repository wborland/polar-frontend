import { GET_LIST_USERS } from "../action_types";

// Action creators

// Initial dialog state
const initialState = {
  listUsers: []
};

// Action helpers

const userListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST_USERS:
      return { ...action.dialog };
    default:
      return state;
  }
};
export default userListReducer;
