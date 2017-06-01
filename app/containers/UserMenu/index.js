import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { logOut } from '../Authentication/actions';
import { selectUser } from '../Authentication/selectors';
import { MenuWrapper, UserName, CaseLoad } from './usermenu.theme';
class UserMenu extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object,
  }
  static defaultProps = {
    user: undefined,
  }
  render() {
    const { user } = this.props;
    // console.log(user);
    return user ? <MenuWrapper>
      <UserName>{user.firstName}</UserName><CaseLoad>{user.activeCaseLoadId}</CaseLoad>
    </MenuWrapper> : null;
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

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
