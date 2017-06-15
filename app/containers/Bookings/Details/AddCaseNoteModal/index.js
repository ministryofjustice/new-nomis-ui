import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
// import { getFormValues } from 'redux-form/immutable';
import { Map } from 'immutable';
import { createFormAction } from 'redux-form-saga';

import { connect } from 'react-redux';
import ModalWrapper from 'components/ModalForm';
import { FormTitle } from 'components/Bookings/Details/CaseNoteForms';

import { closeAddCaseNoteModal } from '../../actions';
import { ADD_NEW_CASENOTE } from '../../constants';
import AddCaseNoteForm from './addCaseNoteForm';
import { selectCaseNoteTypeList, selectCaseNoteSubTypeList } from './selectors';

class AddCaseNoteModal extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const caseNoteTypeList = this.props.caseNoteTypeList.toJS();
    const subTypeList = this.props.caseNoteSubTypeList;
    console.log(subTypeList);
    return (<ModalWrapper closeModal={() => { console.log('close Modal!!!!'); this.props.closeCaseNoteModal(); }} >
      <FormTitle>Add New Case Note</FormTitle>
      <AddCaseNoteForm initialValues={Map({ caseNoteType: caseNoteTypeList[0].value, caseNoteSubType: subTypeList[0].value })} caseNoteTypeList={caseNoteTypeList} caseNoteSubTypeList={subTypeList} onSubmit={this.props.onSubmitForm} />
    </ModalWrapper>);
  }
}

AddCaseNoteModal.propTypes = {
  closeCaseNoteModal: PropTypes.func.isRequired,
  caseNoteTypeList: PropTypes.object.isRequired,
  caseNoteSubTypeList: PropTypes.object.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    closeCaseNoteModal: () => dispatch(closeAddCaseNoteModal()),
    onSubmitForm: createFormAction((formData) => ({ type: ADD_NEW_CASENOTE.BASE, payload: { query: formData, resetPagination: true } }), [ADD_NEW_CASENOTE.SUCCESS, ADD_NEW_CASENOTE.ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
  caseNoteTypeList: selectCaseNoteTypeList(),
  caseNoteSubTypeList: selectCaseNoteSubTypeList(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(AddCaseNoteModal);
