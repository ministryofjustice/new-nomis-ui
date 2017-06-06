import React, { Component } from 'react';
import PropTypes from 'prop-types';

import colours from 'theme/colours';

import listIcon from 'assets/list-icon.svg';
import gridIcon from 'assets/grid-icon.svg';

import { IconSVG, ToggleButton, ToggleButtonContent, ToggleComponent, ToggleContainer } from './mobile.theme';

class ResultsViewToggleMobile extends Component {

  constructor() {
    super();
    this.setToggle = this.setToggle.bind(this);
    this.formatSVG = this.formatSVG.bind(this);
  }

  componentDidMount() {
    this.formatSVG();
  }

  componentDidUpdate() {
    this.formatSVG();
  }

  setToggle(e) {
    this.props.setResultsView(e.currentTarget.dataset.name);
  }

  formatSVG() {
    const listIconFill = document.getElementById('XMLID_42_');
    const gridIconFill = document.getElementById('XMLID_29_');

    const { resultsView } = this.props;

    if (resultsView === 'Grid') {
      listIconFill.style.fill = colours.userMenu.bg;
      gridIconFill.style.fill = 'white';
    } else {
      listIconFill.style.fill = 'white';
      gridIconFill.style.fill = colours.userMenu.bg;
    }
  }

  render() {
    const { resultsView } = this.props;

    let listStyle = {};
    let gridStyle = {};

    if (resultsView === 'Grid') {
      listStyle = {
        color: colours.userMenu.bg,
        backgroundColor: 'white',
      };
      gridStyle = {
        color: 'white',
        backgroundColor: colours.userMenu.bg,
      };
    } else {
      listStyle = {
        color: 'white',
        backgroundColor: colours.userMenu.bg,
      };
      gridStyle = {
        color: colours.userMenu.bg,
        backgroundColor: 'white',
      };
    }

    return (
      <ToggleContainer>
        <ToggleComponent>
          <ToggleButton data-name={'List'} onClick={this.setToggle} style={listStyle}>
            <ToggleButtonContent>List<IconSVG svg={listIcon} /></ToggleButtonContent>
          </ToggleButton>
          <ToggleButton data-name={'Grid'} onClick={this.setToggle} style={gridStyle}>
            <ToggleButtonContent>Grid<IconSVG svg={gridIcon} /></ToggleButtonContent>
          </ToggleButton>
        </ToggleComponent>
      </ToggleContainer>
    );
  }
}

ResultsViewToggleMobile.propTypes = {
  resultsView: PropTypes.string.isRequired,
  setResultsView: PropTypes.func.isRequired,
};

ResultsViewToggleMobile.defaultProps = {
  resultsView: 'List',
};

export default ResultsViewToggleMobile;
