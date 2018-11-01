import React from 'react'
import PropTypes from 'prop-types'

import Image from './theme'

const EliteImage = ({ src }) => <Image src={src} />

EliteImage.propTypes = {
  src: PropTypes.string.isRequired,
}

export default EliteImage
