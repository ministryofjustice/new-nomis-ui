import React from 'react';
import PropTypes from 'prop-types';

const ValueWithLabel = ({ label, children, indent }) => (
  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label className={indent && 'shift-right'}>
        {label}
      </label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <strong>{children}</strong>
    </div>
  </div>
)

ValueWithLabel.defaultProps = {
  children: '--',
  indent: false,
}

ValueWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.string,
  indent: PropTypes.bool,
}

export default ValueWithLabel;
