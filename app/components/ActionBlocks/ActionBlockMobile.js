import React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonLink } from 'components/Button';

import {
  BlockWrapper,
  Title,
  Description,
} from './mobile.theme';

function ActionBlockMobile({ title, description, actionTitle, actionFunc, link }) {
  return (
    <BlockWrapper data-name={'BlockWrapper'}>
      <Title data-name={'Title'}>{title}</Title>
      <Description data-name={'Description'}>{description}</Description>
      {link ?
        <ButtonLink buttonstyle="link" to={link} data-name={'ButtonLink'}>{actionTitle}</ButtonLink> :
        <Button type="link" buttonstyle="link" onClick={actionFunc} data-name={'Button'}>{actionTitle}</Button>
      }
    </BlockWrapper>
  );
}

ActionBlockMobile.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  actionTitle: PropTypes.node,
  actionFunc: PropTypes.func,
  link: PropTypes.string,
};

ActionBlockMobile.defaultProps = {
  title: 'testing',
  description: '1 2 3',
  actionTitle: 'Test Effect',
  actionFunc: () => { },
  link: false,
};

export default ActionBlockMobile;
