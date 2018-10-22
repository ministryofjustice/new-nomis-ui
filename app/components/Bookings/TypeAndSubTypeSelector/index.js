import React, { PureComponent } from 'react'
import { Field } from 'redux-form/immutable'
import SelectWithLabel from 'components/FormComponents/SelectWithLabel'

class TypeAndSubTypeSelector extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { resetSubType: false }
    this.onTypeChange = this.onTypeChange.bind(this)
    this.onSubTypeChange = this.onSubTypeChange.bind(this)
  }

  componentDidMount() {
    const { selectedSubType } = this.props
    this.state = {
      resetSubType: !selectedSubType && false,
    }
  }

  onTypeChange() {
    this.setState({
      resetSubType: true,
    })
  }

  onSubTypeChange() {
    this.setState({
      resetSubType: false,
    })
  }

  render() {
    const { types, subTypes, selectedType } = this.props
    const { resetSubType } = this.state

    const constrainedSubTypes = (subTypes || []).filter(st => st.parent === selectedType)

    return (
      <span>
        <Field title="Type" component={SelectWithLabel} name="typeValue" options={types} onChange={this.onTypeChange} />
        <Field
          title="Sub-type"
          component={SelectWithLabel}
          name="subTypeValue"
          options={constrainedSubTypes}
          onChange={this.onSubTypeChange}
          resetValue={resetSubType}
        />
      </span>
    )
  }
}

export default TypeAndSubTypeSelector
