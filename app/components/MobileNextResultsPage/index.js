import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/Button';
import { ButtonContainer } from './theme';

function MobileNextResultsPage({ pagination, totalRecords, pageAction }) {
  const { perPage: pP, pageNumber: pN } = pagination;
  const pageAmount = Math.ceil(totalRecords / (pP));

  return (
    <ButtonContainer>
      { pageAmount - 1 !== pN && totalRecords > 0 ? <Button onClick={() => { pageAction(pN + 1); }} buttonstyle="link" style={{ width: '100%' }}>Next</Button> : null }
    </ButtonContainer>
  );
}

MobileNextResultsPage.propTypes = {
  pagination: PropTypes.object.isRequired,
  totalRecords: PropTypes.number.isRequired,
  pageAction: PropTypes.func.isRequired,
};

MobileNextResultsPage.defaultProps = {
};

export default MobileNextResultsPage;
