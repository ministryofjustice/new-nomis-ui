import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import BookingsDetailsHeader from 'components/Bookings/Details/headerMobile';

import { selectHeaderDetail } from '../selectors';

class Header extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  // componentWillMount() {
  // }

  render() {
    const { headerDetails, tabData } = this.props;

    return (<BookingsDetailsHeader inmateData={headerDetails} tabData={tabData} />);
  }
}

Header.propTypes = {
  headerDetails: PropTypes.object.isRequired,
  tabData: PropTypes.object.isRequired,
};

export function mapDispatchToProps() {
  return {
  };
}

const mapStateToProps = createStructuredSelector({
  headerDetails: selectHeaderDetail(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
