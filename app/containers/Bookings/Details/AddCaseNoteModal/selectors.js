
import { createSelector } from 'reselect';
import { selectCaseNoteTypesSelect } from 'containers/EliteApiLoader/selectors';
import { getFormValues } from 'redux-form/immutable';
import { List } from 'immutable';

const selectCaseNoteFormVals = () => (state) => getFormValues('addCaseNote')(state);

const selectCaseNoteTypeList = selectCaseNoteTypesSelect;

const selectCaseNoteSubTypeList = () => createSelector(
  selectCaseNoteTypeList(),
  selectCaseNoteFormVals(),
  (caseNoteTypes, formVals) => {
    console.log(formVals);
    if (!formVals) return [{ value: 'Select Case Note Type' }];
    const typeCode = formVals.get('caseNoteType');
    const filteredList = caseNoteTypes.filter((c) => c.value === typeCode);
    console.log(filteredList);
    const onlyItem = filteredList.get(0);
    console.log(onlyItem);
    const subTypes = onlyItem.subTypes;
    return subTypes;
  }
);

export {
  selectCaseNoteTypeList,
  selectCaseNoteSubTypeList,
};
