import { GET_ROLES } from "../action_types";

// Action creators

// Initial dialog state
const initialState = {
  listRoles: []
};

// Action helpers

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLES:
      return { ...action.dialog };
    default:
      return state;
  }
};
export default roleReducer;
