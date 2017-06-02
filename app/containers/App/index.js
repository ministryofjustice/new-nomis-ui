import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import Header from 'containers/Header';

class App extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: [],
  };

  render() {
    return (
      <div>
        <Helmet title="P-Nomis" />
        <Header />
        {React.Children.toArray(this.props.children)}

      </div>
    );
  }
}

export default App;
