import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loadOfficer } from 'containers/EliteApiLoader/actions';
import { selectOfficerName } from './selectors';
// import { Image } from './theme';

class EliteOfficerName extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: intlShape.isRequired,
  }

  static propTypes = {
    name: PropTypes.object.isRequired,
    loadOfficer: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.loadOfficer();
  }

  render() {
    const { name } = this.props;
    const { firstName, lastName, staffId } = name;

    if (firstName && lastName) {
      return <div>{lastName}, {firstName}</div>;
    } else if (firstName) {
      return <div>{firstName}</div>;
    } else if (lastName) {
      return <div>{lastName}</div>;
    }
    return <div>{staffId}</div>;
  }

}

export function mapDispatchToProps(dispatch, props) {
  return {
    loadOfficer: () => { dispatch(loadOfficer(props.staffId, props.username)); },
  };
}

const mapStateToProps = createStructuredSelector({
  name: selectOfficerName(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EliteOfficerName);
