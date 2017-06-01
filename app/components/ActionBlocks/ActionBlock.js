import React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonLink } from 'components/Button';

import {
  BlockWrapper,
  Title,
  Description,
} from './actionblock.theme';

function ActionBlock({ title, description, actionTitle, actionFunc, link }) {
  return (
    <BlockWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {link ?
        <ButtonLink buttonstyle="link" to={link}>{actionTitle}</ButtonLink> :
        <Button type="link" buttonstyle="link" onClick={actionFunc}>{actionTitle}</Button>
      }
    </BlockWrapper>
  );
}

ActionBlock.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  actionTitle: PropTypes.node,
  actionFunc: PropTypes.func,
  link: PropTypes.string,
};

ActionBlock.defaultProps = {
  title: 'testing',
  description: '1 2 3',
  actionTitle: 'Test Effect',
  actionFunc: () => { },
  link: false,
};

export default ActionBlock;
