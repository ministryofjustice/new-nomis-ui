import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TitleBlock from 'components/TitleBlock';
import ActionBlocks from 'components/ActionBlocks';

// import translations from './translations';

import {
  CenteredFlexColumn,
} from 'components/DesktopWrappers';

import { logOut } from '../Authentication/actions';
import { selectUser } from '../Authentication/selectors';
class HomePage extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    // user: PropTypes.object,
    // logOut: PropTypes.func,
  }
  render() {
    return (
      <CenteredFlexColumn>
        <TitleBlock title={'Welcome'} subtitle={'To Prison Nomis'} />
        <ActionBlocks
          actions={[{
            key: '1',
            title: 'Search Offenders',
            actionTitle: 'Search Offenders',
            link: '/search',
            description: '' },
          {
            key: '2',
            title: 'Berwyn Assignments',
            actionTitle: 'See Assignments',
            link: '/',
            description: '' },
          ]}
        />

      </CenteredFlexColumn>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(logOut()),
  };
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
