
import { createSelector } from 'reselect';
import { selectEliteApi } from 'containers/EliteApiLoader/selectors';
import { getFormValues } from 'redux-form/immutable';

const selectCaseNoteFormVals = () => (state) => getFormValues('addCaseNote')(state);

const selectCaseNoteTypeList = () => createSelector(
  selectEliteApi(),
  (eliteApi) => eliteApi.getIn(['User', 'CaseNoteTypes'])
);

const selectCaseNoteSubTypeList = () => createSelector(
  selectEliteApi(),
  (eliteApi) => eliteApi.getIn(['User', 'CaseNoteSubTypes'])
);

export {
  selectCaseNoteFormVals,
  selectCaseNoteTypeList,
  selectCaseNoteSubTypeList,
};
