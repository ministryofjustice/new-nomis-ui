import React, { PureComponent } from 'react'
import { Field } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import SelectWithLabel from '../../FormComponents/SelectWithLabel'
import SelectWithLabelAndMagicAllOption from '../../FormComponents/SelectWithLabelAndMagicAllOption'

export const typeSelectorType = PropTypes.arrayOf(
  PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired }).isRequired
)

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
      <span>
        <Field
          title="Type"
          component={SelectWithLabelAndMagicAllOption}
          name="typeValue"
          options={types}
          onChange={this.onTypeChange}
        />

        <Field
          title="Sub-type"
          component={SelectWithLabel}
          name="subTypeValue"
          options={filteredSubTypes}
          onChange={this.onSubTypeChange}
          resetValue={resetSubType}
        />
      </span>
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
