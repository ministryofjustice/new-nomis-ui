
import { createSelector } from 'reselect';
import { selectCaseNoteTypesSelect } from 'containers/EliteApiLoader/selectors';
import { getFormValues } from 'redux-form/immutable';

const selectCaseNoteFormVals = () => (state) => getFormValues('addCaseNote')(state);

const selectCaseNoteTypeList = selectCaseNoteTypesSelect;

const selectCaseNoteSubTypeList = () => createSelector(
  selectCaseNoteTypeList(),
  selectCaseNoteFormVals(),
  (caseNoteTypes, formVals) => {
    if (!formVals) return caseNoteTypes.get(0).subTypes;
    const typeCode = formVals.get('caseNoteType');
    const filteredList = caseNoteTypes.filter((c) => c.value === typeCode);
    const onlyItem = filteredList.get(0);
    const subTypes = onlyItem.subTypes;
    return subTypes;
  }
);

export {
  selectCaseNoteTypeList,
  selectCaseNoteSubTypeList,
};
