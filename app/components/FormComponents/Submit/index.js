import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { SubmitStyle } from './submit.theme'

export default class Submit extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
  }

  static defaultProps = {
    value: 'Submit',
  }

  render() {
    const { value } = this.props
    return <SubmitStyle type="submit" value={value} />
  }
}
