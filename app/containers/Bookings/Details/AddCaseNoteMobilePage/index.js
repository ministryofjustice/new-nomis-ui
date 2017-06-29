import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';

import { closeAddCaseNoteModal } from '../../actions';
import { ADD_NEW_CASENOTE } from '../../constants';
import AddCaseNoteForm from '../AddCaseNoteModal/addCaseNoteForm';
import { selectCaseNoteTypeList, selectCaseNoteSubTypeList } from '../AddCaseNoteModal/selectors';

class AddCaseNotePageMobile extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.context.router.goBack();
  }

  render() {
    return (
      <AddCaseNoteForm
        isMobile
        goBack={this.context.router.goBack}
      />
    );
  }
}

AddCaseNotePageMobile.propTypes = {
  caseNoteTypeList: PropTypes.object.isRequired,
  caseNoteSubTypeList: PropTypes.array.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
};

AddCaseNotePageMobile.defaultProps = {
};

AddCaseNotePageMobile.contextTypes = {
  router: PropTypes.object.isRequired,
};


const mapStateToProps = createStructuredSelector({
  caseNoteTypeList: selectCaseNoteTypeList(),
  caseNoteSubTypeList: selectCaseNoteSubTypeList(),

});

export function mapDispatchToProps(dispatch) {
  return {
    closeCaseNoteModal: () => dispatch(closeAddCaseNoteModal()),
    onSubmitForm: createFormAction((formData) => ({ type: ADD_NEW_CASENOTE.BASE, payload: { query: formData.toJS() } }), [ADD_NEW_CASENOTE.SUCCESS, ADD_NEW_CASENOTE.ERROR]),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCaseNotePageMobile);
