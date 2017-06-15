import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TitleBlock from 'components/TitleBlock';
import ActionBlocks from 'components/ActionBlocks';
import ActionBlocksMobile from 'components/ActionBlocks/mobile';

// import translations from './translations';

import {
  CenteredFlexColumn,
} from 'components/DesktopWrappers';

import { selectDeviceFormat } from 'selectors/app';

import { logOut } from '../Authentication/actions';
import { selectUser } from '../Authentication/selectors';
class HomePage extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    // user: PropTypes.object,
    // logOut: PropTypes.func,
  }
  componentWillMount() {
    // this.props.test();
  }
  render() {
    const { deviceFormat } = this.props;

    const actions = [{
      key: '1',
      title: 'Search Offenders',
      actionTitle: 'Search Offenders',
      link: '/search',
      description: 'Search for Offenders within your selected prison' },
    {
      key: '2',
      title: 'My Assignments',
      actionTitle: 'See My Assignments',
      link: '/',
      description: 'View your current assignments' },
    ];

    return (
      <CenteredFlexColumn>
        <TitleBlock title={'Welcome'} subtitle={'To Prison Nomis'} />
        { deviceFormat === 'desktop' ? <ActionBlocks actions={actions} /> : <ActionBlocksMobile actions={actions} /> }

      </CenteredFlexColumn>
    );
  }
}

HomePage.propTypes = {
  deviceFormat: PropTypes.string.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(logOut()),
    // test: () => dispatch(loadAlertTypeDetails('X', 'XRF')),
  };
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  deviceFormat: selectDeviceFormat(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
