import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import UserMenu from 'containers/UserMenu';
import HeaderComponent from 'components/Header';
// import { selectHeader } from './selectors';

// import translations from './translations';
// import LanguageSelect from '../LanguageSelect';
class HeaderContainer extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: intlShape.isRequired,
  }

  static propTypes = {
    // children: PropTypes.node.isRequired,
  }

  render() {
    return <HeaderComponent menuComponent={<UserMenu />}></HeaderComponent>;
  }

}

export default connect(null, null)(HeaderContainer);
