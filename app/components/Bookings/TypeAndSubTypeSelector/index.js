import React from 'react';
import { Field} from 'redux-form/immutable';
import SelectWithLabel from 'components/FormComponents/SelectWithLabel';

const TypeAndSubTypeSelector = ({selectedType,types,subTypes}) => {

    const constrainedSubTypes = (subTypes || []).filter(st => st.parent === selectedType);

    return (
      <div>
        <Field title='Type' component={SelectWithLabel} name="typeValue" options={types}/>
        <Field title='Sub-Type' component={SelectWithLabel} name="subTypeValue" options={constrainedSubTypes}/>
      </div>
    )
}

export default TypeAndSubTypeSelector;