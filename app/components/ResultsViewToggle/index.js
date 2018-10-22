import React, { Component } from 'react'
import PropTypes from 'prop-types'

import colours from 'theme/colours'

import listIcon from 'assets/list-icon.svg'
import gridIcon from 'assets/grid-icon.svg'

import { IconSVG, ToggleButton } from './theme'

class ResultsViewToggle extends Component {
  constructor() {
    super()
    this.setToggle = this.setToggle.bind(this)
    this.formatSVG = this.formatSVG.bind(this)
  }

  componentDidMount() {
    this.formatSVG()
  }

  componentDidUpdate() {
    this.formatSVG()
  }

  setToggle(e) {
    const { setResultsView } = this.props
    setResultsView(e.currentTarget.dataset.name)
  }

  formatSVG() {
    const listIconFill = document.getElementById('XMLID_42_')
    const gridIconFill = document.getElementById('XMLID_29_')

    const { resultsView } = this.props

    if (resultsView === 'List') {
      listIconFill.style.fill = colours.userMenu.bg
      gridIconFill.style.fill = colours.baseFont
    } else {
      listIconFill.style.fill = colours.baseFont
      gridIconFill.style.fill = colours.userMenu.bg
    }
  }

  render() {
    const { resultsView } = this.props

    let listStyle = {}
    let gridStyle = {}

    if (resultsView === 'List') {
      listStyle = { color: colours.userMenu.bg }
      gridStyle = { color: colours.baseFont }
    } else {
      listStyle = { color: colours.baseFont }
      gridStyle = { color: colours.userMenu.bg }
    }

    return (
      <div className="pull-right">
        <ToggleButton data-name="List" onClick={this.setToggle} style={listStyle}>
          List
          <IconSVG svg={listIcon} />
        </ToggleButton>
        <ToggleButton data-name="Grid" onClick={this.setToggle} style={gridStyle}>
          Grid
          <IconSVG svg={gridIcon} />
        </ToggleButton>
      </div>
    )
  }
}

ResultsViewToggle.propTypes = {
  resultsView: PropTypes.string,
  setResultsView: PropTypes.func.isRequired,
}

ResultsViewToggle.defaultProps = {
  resultsView: 'List',
}

export default ResultsViewToggle
