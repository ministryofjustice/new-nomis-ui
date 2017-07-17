import React from 'react';
import PropTypes from 'prop-types';

import {
  LeftWrapper,
  RightWrapper,
  CenterWrapper,
  Wrapper,
  Title
} from './theme';

// If no 'align' attribute specified, TitleBlock is responsive. If 'align' attribute is provided, specified alignment
// is enfored. Supported 'align' attribute values are: left|center|right - anything else results in default, responsive
// behaviour.
function TitleBlock({ align, title, subtitle }) {
  switch (align ) {
    case 'left':
      return (
        <LeftWrapper>
          <Title>{title}</Title>
        </LeftWrapper>
      );

      break;

    case 'right':
      return (
        <RightWrapper>
          <Title>{title}</Title>
        </RightWrapper>
      );

      break;

    case 'center':
      return (
        <CenterWrapper>
          <Title>{title}</Title>
        </CenterWrapper>
      );

      break;

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
  subtitle: PropTypes.node,
};

TitleBlock.defaultProps = {
  align: 'default',
  title: 'testing',
  subtitle: '1 2 3',
};

export default TitleBlock;
