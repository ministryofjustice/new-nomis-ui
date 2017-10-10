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
    // Change state here (after initial render) to force transition effect on re-render.
    if (this.props.toggleState) {
      this.setState({ className: 'open' });  // eslint-disable-line react/no-did-mount-set-state
    } else {
      this.setState({ className: '' });      // eslint-disable-line react/no-did-mount-set-state
    }
  }

  render() {
    return (
      <div id="nav-icon" onClick={this.props.onToggle} className={this.state.className}>
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
