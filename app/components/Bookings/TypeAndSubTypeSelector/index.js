import React, { PureComponent } from 'react'
import { Field } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import SelectWithLabel from '../../FormComponents/SelectWithLabel'

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

TypeAndSubTypeSelector.propTypes = {
  types: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired }).isRequired
  ).isRequired,
  subTypes: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired }).isRequired
  ).isRequired,
  selectedSubType: PropTypes.string.isRequired,
  selectedType: PropTypes.string.isRequired,
}

export default TypeAndSubTypeSelector
