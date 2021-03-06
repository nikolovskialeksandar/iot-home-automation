import * as actionTypes from '../actions/actionTypes';

const initialState = {
  todayData: null,
  lastValue: null,
  error: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_METEO_DATA:
      return {
        ...state,
        todayData: action.todayData,
        lastValue: action.lastValue,
        error: false,
      };
    case actionTypes.FETCH_METEO_DATA_FAILED:
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
};

export default reducer;
