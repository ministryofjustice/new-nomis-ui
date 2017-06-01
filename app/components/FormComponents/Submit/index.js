import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SubmitStyle } from './submit.theme';

export default class Submit extends PureComponent {

  static propTypes = {
    value: PropTypes.string,
    // large: PropTypes.bool,
    // blue: PropTypes.bool,
    // center: PropTypes.bool,
    // className: PropTypes.string,
  }

  static defaultProps = {
    value: 'Submit',
    large: false,
    blue: false,
    center: false,
  }

  render() {
    return (
      <SubmitStyle type="submit" value={this.props.value} />
    );
  }

}
