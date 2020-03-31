import { GET_TABLE_LIST, GET_INDIV_TABLE } from "../action_types";
import axios from "axios";
import { message } from "antd";

// Action creators
const saveTableList = list => ({
  type: GET_TABLE_LIST,
  list
});

const saveIndivTable = table => ({
  type: GET_INDIV_TABLE,
  table
});

// Initial dialog state
const initialState = {
  tableList: [],
  tableInfo: {
    tableTitle: "",
    tableHeaders: [],
    tableCell: []
  }
};

// Action helpers
export const getTableList = auth => dispatch => {
  axios
    .post("/table/all", { auth: auth })
    .then(response => {
      let tableList = [];
      if (response.data) {
        for (let key in response.data) {
          tableList.push({
            key: response.data[key][0],
            tableName: response.data[key][1]
          });
        }
      }
      dispatch(saveTableList(tableList));
    })
    .catch(err => {
      message.error("Something went wrong, please try again", 5);
    });
};

// export const getIndivTable=(auth, )

const tableListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TABLE_LIST:
      return Object.assign({}, state, {
        tableList: action.list
      });
    case GET_INDIV_TABLE:
      return Object.assign({}, state, { tableInfo: action.table });
    default:
      return state;
  }
};

export default tableListReducer;
