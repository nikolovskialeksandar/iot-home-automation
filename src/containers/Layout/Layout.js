import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import Navbar from '../../components/Navigation/Navbar/Navbar';
import MonthView from '../../components/MonthView/MonthView';
import Dashboard from '../../components/Dashboard/Dashboard';
import Logout from '../../containers/Auth/Logout/Logout';
import * as actionCreators from '../../store/actions/index';

const Layout = (props) => {
	const [sideDrawerVisible, setSideDrawerVisible] = useState(false);
	useEffect(() => {
		props.initMeteoData(props.token);
		props.initSonoffData(props.token);
	}, []);
	const sideDrawerShow = () => {
		const updatedState = sideDrawerVisible;
		setSideDrawerVisible(!updatedState);
	}

	return (
		<div className="layout">
			<Navbar clicked={sideDrawerShow} />
			<Switch>
				<Route path="/logout" component={Logout} />
				<Route path="/month" render={() => (
					<MonthView
						monthData={props.monthData} 
						selectedMonth={props.selectedMonth}
						calculateMonthData={(event) => props.calculateMonthData(props.token, event)}
					/>
				)} />
				<Route path="/"  render={() => (
					<Dashboard 
						todayData={props.todayData}
						lastValue={props.lastValue}
						sonoffState={props.sonoffState}
						sonoffSwitch={() => props.sendSonoffData(props.sonoffState, props.token)}
					/>
				)} />
			</Switch>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		meteoData: state.meteo.meteoData,
		monthData: state.meteo.monthData,
		todayData: state.meteo.todayData,
		lastValue: state.meteo.lastValue,
		sonoffState: state.sonoff.sonoffState,
		selectedMonth: state.meteo.selectedMonth,
		token: state.auth.token
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		initMeteoData: (token) => dispatch(actionCreators.initMeteoData(token)),
		initSonoffData:(token) => dispatch(actionCreators.initSonoffData(token)),
		sendSonoffData:(sonoffState, token) => dispatch(actionCreators.sendSonoffData(sonoffState, token)),
		calculateMonthData:(token, event) => dispatch(actionCreators.calculateMonthData(token, event))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout); 