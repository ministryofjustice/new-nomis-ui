import React, { PureComponent } from 'react'
import { Field } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { Select } from '../../FormComponents'
import { typeSelectorType } from '../../../types'

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
    const filteredSubTypes = (subTypes || []).filter(st => st.parent === selectedType)

    return (
      <React.Fragment>
        <Field label="Type" component={Select} name="typeValue" onChange={this.onTypeChange}>
          {types.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Field>

        <Field
          label="Sub-type"
          component={Select}
          name="subTypeValue"
          onChange={this.onSubTypeChange}
          resetValue={resetSubType}
        >
          {filteredSubTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Field>
      </React.Fragment>
    )
  }
}

TypeAndSubTypeSelector.propTypes = {
  types: typeSelectorType.isRequired,
  subTypes: typeSelectorType.isRequired,
  selectedSubType: PropTypes.string,
  selectedType: PropTypes.string,
}

TypeAndSubTypeSelector.defaultProps = {
  selectedType: null,
  selectedSubType: null,
}

export default TypeAndSubTypeSelector
