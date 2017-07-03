import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TitleBlock from 'components/TitleBlock';
import TitleBlockMobile from 'components/TitleBlock/mobile';
import ActionBlocks from 'components/ActionBlocks';
import ActionBlocksMobile from 'components/ActionBlocks/mobile';

// import translations from './translations';

// import { loadUserCaseLoads } from 'containers/EliteApiLoader/actions';
import { LOAD_ASSIGNMENTS } from 'containers/Assignments/constants';
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
  }
  componentDidMount() {
    // this.props.test();
  }
  render() {
    const { deviceFormat } = this.props;

    const actions = [{
      key: '1',
      title: 'Search Offenders',
      actionTitle: 'Search Offenders',
      link: '/search',
      description: '' },
    {
      key: '2',
      title: 'My Assignments',
      actionTitle: 'See My Assignments',
      link: '/assignments',
      description: '' },
    ];

    return (
      deviceFormat === 'desktop' ?
        <CenteredFlexColumn>
          <TitleBlock title={'Welcome'} subtitle={'Prison-NOMIS'} />
          <ActionBlocks actions={actions} />
        </CenteredFlexColumn>
        :
        <CenteredFlexColumn>
          <TitleBlockMobile title={'Welcome'} subtitle={'Prison-NOMIS'} />
          <ActionBlocksMobile actions={actions} />
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
    test: () => dispatch({ type: LOAD_ASSIGNMENTS, payload: {} }),
  };
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  deviceFormat: selectDeviceFormat(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
