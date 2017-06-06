
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import { search } from './actions';
import { } from '../../selectors';

class Alerts extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (<div>
      Alerts to be rendered!
    </div>);
  }
}

Alerts.propTypes = {
  // physicalAttributes: PropTypes.array.isRequired,
};

export function mapDispatchToProps() {
  return {
    // loadBookingDetails: (id) => dispatch(loadBookingDetails(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  // physicalAttributes: selectPhysicalAttributes(),
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
