import React from 'react';
import PropTypes from 'prop-types';

const ValueWithLabel = ({ label, children, indent }) => (
  <div className="value-with-label row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label className={`value-with-label__label ${indent && 'shift-right'}`}>
        {label}
      </label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <strong className="value-with-label__value">
        {children}
      </strong>
    </div>
  </div>
)

ValueWithLabel.defaultProps = {
  children: '--',
  indent: false,
}

ValueWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  indent: PropTypes.bool,
}

export default ValueWithLabel;
