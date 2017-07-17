import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TitleBlock from 'components/TitleBlock';
import ActionBlocks from 'components/ActionBlocks';
import ActionBlocksMobile from 'components/ActionBlocks/mobile';
import { LOAD_ASSIGNMENTS } from 'containers/Assignments/constants';
import { ContentWrapper } from 'components/DesktopWrappers';
import { logOut } from '../Authentication/actions';
import { selectUser } from '../Authentication/selectors';
import { setSearchContext } from 'globalReducers/app';

import {
  DesktopOnly,
  MobileOnly
} from 'components/CommonTheme';

class HomePage extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('none');
  }

  render() {
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
      <ContentWrapper>
        <TitleBlock align="center" title={'Welcome'} subtitle={'Prison-NOMIS'} />
        <DesktopOnly>
          <ActionBlocks actions={actions} />
        </DesktopOnly>
        <MobileOnly>
          <ActionBlocksMobile actions={actions} />
        </MobileOnly>
      </ContentWrapper>
    );
  }
}

HomePage.defaultProps = {
  setSearchContext: () => {},
};

HomePage.propTypes = {
  setSearchContext: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(logOut()),
    test: () => dispatch({ type: LOAD_ASSIGNMENTS, payload: {} }),
    setSearchContext: (context) => dispatch(setSearchContext(context)),
  };
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
