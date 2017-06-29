import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { closeAmendCaseNoteModal } from 'containers/Bookings/actions';
import CaseNoteFilterForm from './caseNoteFilterForm';

class CaseNoteFilterFormMobile extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.context.router.goBack();
  }

  render() {
    return (
      <CaseNoteFilterForm
        isMobile
        goBack={this.context.router.goBack}
      />
    );
  }
}

CaseNoteFilterFormMobile.propTypes = {
};

CaseNoteFilterFormMobile.defaultProps = {
};

CaseNoteFilterFormMobile.contextTypes = {
  router: PropTypes.object.isRequired,
};


const mapStateToProps = createStructuredSelector({
});

export function mapDispatchToProps(dispatch) {
  return {
    closeAmendCaseNoteModal: () => dispatch(closeAmendCaseNoteModal()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseNoteFilterFormMobile);
