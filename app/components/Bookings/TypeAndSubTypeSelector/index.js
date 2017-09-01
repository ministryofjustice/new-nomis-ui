import React,{PureComponent} from 'react';
import { Field} from 'redux-form/immutable';
import SelectWithLabel from 'components/FormComponents/SelectWithLabel';


class TypeAndSubTypeSelector extends PureComponent{
  constructor(){
     super();

     this.onTypeChange = this.onTypeChange.bind(this);
     this.onSubTypeChange = this.onSubTypeChange.bind(this);

     this.state = {
       resetSubType: true
     };
  }

  onTypeChange(){
    this.setState({
      resetSubType: true
    });
  }

  onSubTypeChange(){
    this.setState({
      resetSubType: false
    });
  }

  render(){

    const {types,subTypes,selectedType} = this.props;
    const {resetSubType} = this.state;
    const constrainedSubTypes =
      (subTypes || []).filter(st => st.parent === selectedType);

    return (
      <div>
        <Field
          title='Type'
          component={SelectWithLabel}
          name="typeValue"
          options={types}
          onChange={this.onTypeChange}
        />
        <Field
          title='Sub-Type'
          component={SelectWithLabel}
          name="subTypeValue"
          options={constrainedSubTypes}
          onChange={this.onSubTypeChange}
          resetValue={resetSubType}
        />
      </div>
    )
  }
}



export default TypeAndSubTypeSelector;