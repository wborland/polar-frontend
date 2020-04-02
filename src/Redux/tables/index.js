import {
  GET_TABLE_LIST
} from "../action_types";
import axios from "axios";
import { message } from "antd";

// Action creators
const saveTableList = list => ({
  type: GET_TABLE_LIST,
  list
});

// Initial dialog state
const initialState = {
  tableList: []
};

// Action helpers
export const getTableList = auth => dispatch => {
  axios.post("/table/all", { "auth": auth })
    .then((response) => {
      let tableList = [];
      if(response.data) {
        for(let key in response.data) {
          tableList.push({
            "key": response.data[key][0],
            "tableName": response.data[key][1]
          });
        }
      }
      dispatch(saveTableList(tableList));
    })
    .catch( (err) => {
      message.error("Something went wrong, please try again", 5);
    });
};

const tableListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TABLE_LIST:
      return Object.assign({}, state, {
        tableList: action.list,
      });
    default:
      return state;
  }
};

export default tableListReducer;