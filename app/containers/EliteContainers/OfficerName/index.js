import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loadOfficer } from 'containers/EliteApiLoader/actions';
import { selectOfficerName } from './selectors';
import { toFullName } from 'utils/stringUtils';

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

    if (name.firstName || name.lastName) {
      return <span>{toFullName(name)}</span>;
    } else {
      return <span>{name.staffId}</span>
    }
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
