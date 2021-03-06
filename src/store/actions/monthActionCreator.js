import axios from 'axios';

import * as actionTypes from './actionTypes';

require('dotenv').config();

const twoDigitsTimeFormater = (val) => {
  let twoDigits = val.toString();
  if (twoDigits.length === 1) {
    twoDigits = `0${val}`;
  }

  return twoDigits;
};

export const setMonthData = (monthData, selectedMonth) => {
  return {
    type: actionTypes.SET_MONTH_DATA,
    monthData,
    selectedMonth,
  };
};

export const fetchMonthDataFailed = (error) => {
  return {
    type: actionTypes.FETCH_MONTH_DATA_FAILED,
    error,
  };
};

export const calculateMonthData = (token, month, year) => {
  return (dispatch) => {
    const selectedMonth = month;
    const url = `${process.env.REACT_APP_FIREBASE_PROJECT_ID}/meteoData/${year}/${
      +selectedMonth + 1
    }.json?auth=${token}`;
    axios
      .get(url)
      .then((response) => {
        let monthDataArray = [];

        if (response.data) {
          let monthData = Object.keys(response.data).map((val) => {
            return response.data[val];
          });

          monthData = monthData.filter((val) => {
            return val !== null;
          });

          let averageTemp,
            averageHumid,
            averageLight,
            maxTemp,
            minTemp,
            maxHumid,
            minHumid,
            dataCounter,
            time;
          averageTemp = averageHumid = averageLight = maxTemp = minTemp = maxHumid = minHumid = dataCounter = 0;
          monthData.forEach((val) => {
            Object.keys(val).forEach((key) => {
              if (dataCounter === 0) {
                const date = new Date(val[key].time);
                time = `${twoDigitsTimeFormater(date.getDate())}.${twoDigitsTimeFormater(
                  date.getMonth() + 1,
                )}`;
                minTemp = val[key].temperature;
                maxTemp = val[key].temperature;
                minHumid = val[key].humidity;
                maxHumid = val[key].humidity;
              } else if (val[key].temperature > maxTemp) {
                maxTemp = val[key].temperature;
              } else if (val[key].temperature < minTemp) {
                minTemp = val[key].temperature;
              } else if (val[key].humidity > maxHumid) {
                maxHumid = val[key].humidity;
              } else if (val[key].humidity < minHumid) {
                minHumid = val[key].humidity;
              }

              averageTemp += val[key].temperature;
              averageHumid += val[key].humidity;
              averageLight += val[key].light ? val[key].light : 0;
              dataCounter++;
            });

            monthDataArray.push({
              temperature: +(averageTemp / dataCounter).toFixed(1),
              humidity: +(averageHumid / dataCounter).toFixed(1),
              light: +(averageLight / dataCounter).toFixed(1),
              time,
              maxTemp: +maxTemp.toFixed(1),
              minTemp: +minTemp.toFixed(1),
              minHumid: +minHumid.toFixed(1),
              maxHumid: +maxHumid.toFixed(1),
            });

            averageTemp = averageHumid = averageLight = maxTemp = minTemp = maxHumid = minHumid = dataCounter = 0;
          });
        } else {
          monthDataArray = null;
        }

        dispatch(setMonthData(monthDataArray, selectedMonth));
      })
      .catch((error) => {
        dispatch(fetchMonthDataFailed(error));
      });
  };
};
