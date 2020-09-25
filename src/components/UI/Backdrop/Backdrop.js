import React from 'react';
import PropTypes from 'prop-types';

import './Backdrop.css';

const backdrop = (props) => (
    props.show ? <div className="backdrop" onClick={props.clicked}></div> : null
);

backdrop.propTypes = {
	show: PropTypes.bool.isRequired,
	clicked: PropTypes.func
};

export default backdrop