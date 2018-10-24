import React from 'react'
import PropTypes from 'prop-types'

import { LeftWrapper, RightWrapper, CenterWrapper, Wrapper, Title } from './theme'

// If no 'align' attribute specified, TitleBlock is responsive. If 'align' attribute is provided, specified alignment
// is enfored. Supported 'align' attribute values are: left|center|right - anything else results in default, responsive
// behaviour.
function TitleBlock({ align, title }) {
  switch (align) {
    case 'left':
      return (
        <LeftWrapper>
          <Title>{title}</Title>
        </LeftWrapper>
      )

    case 'right':
      return (
        <RightWrapper>
          <Title>{title}</Title>
        </RightWrapper>
      )

    case 'center':
      return (
        <CenterWrapper>
          <Title>{title}</Title>
        </CenterWrapper>
      )

    default:
      return (
        <Wrapper>
          <Title>{title}</Title>
        </Wrapper>
      )
  }
}

TitleBlock.propTypes = {
  align: PropTypes.string,
  title: PropTypes.node,
}

TitleBlock.defaultProps = {
  align: 'default',
  title: 'testing',
}

export default TitleBlock
