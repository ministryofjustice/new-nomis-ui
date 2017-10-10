import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './toggle.scss';

class MenuToggle extends Component {

  componentWillMount() {
    this.setState({
      className: this.props.toggleState ? '' : 'open',
    })
  }

  componentDidMount() {
    if (this.props.toggleState) {
      this.setState({ className: 'open' });
    } else {
      this.setState({ className: '' });
    }
  }

  render() {
    return (
      <div id='nav-icon' onClick={this.props.onToggle} className={this.state.className}>
        <span></span>
        <span></span>
        <span></span>
      </div>)
  }
}

MenuToggle.propTypes = {
  toggleState: PropTypes.bool,
  onToggle: PropTypes.func,
};

MenuToggle.defaultProps = {
  toggleState: false,
  onToggle: () => {},
};

export default MenuToggle;
