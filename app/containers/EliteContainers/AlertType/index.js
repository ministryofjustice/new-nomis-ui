import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loadAlertTypeDetails } from 'containers/EliteApiLoader/actions';
import { selectAlertInfo } from './selectors';
import { } from './theme';

class EliteAlertType extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadAlertType();
  }

  render() {
    const { alertInfo } = this.props;
    // FIXME probably use a styled component here; not sure what all the use cases are though
    // thus for now leaving it as an img.
    return <div>{JSON.stringify(alertInfo, null, '  ')}</div>; // eslint-disable-line
  }

}

EliteAlertType.propTypes = {
  alertInfo: PropTypes.object.isRequired,
  loadAlertType: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch, props) {
  return {
    loadAlertType: () => dispatch(loadAlertTypeDetails(props.alertType, props.alertCode)),
  };
}

const mapStateToProps = createStructuredSelector({
  alertInfo: selectAlertInfo(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EliteAlertType);
