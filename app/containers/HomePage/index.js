import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { LOAD_ASSIGNMENTS } from 'containers/Assignments/constants';
import Name from 'components/Name';
import { Link } from 'react-router';
import SearchForm from './SearchForm';

import {
  loadLocations,
} from '../Bookings/actions';
import {setOmicUrl} from "../Authentication/actions";

import {
  selectLocations, selectUserHomeInfo, selectOmicUrl
} from './selectors';
import axios from "axios/index";

import './homepage.scss';

class HomePage extends Component {

  componentDidMount() {
    this.requestOmicUrl();
    this.props.loadLocations();
  }

  userIsKeyworkerAdmin() {
    return this.props.user && this.props.user.roles
      && this.props.user.roles.findIndex(e => e.roleCode === "KW_ADMIN") >= 0;
  }

  requestOmicUrl() {
    axios.get('/config').then(response => {
      this.props.setOmicUrl(response.data.omicUrl);
    });
  }

  render() {
    const { user, locations } = this.props;

    if (!user) {
      return <div></div>
    }

    return <div>
      <h1 className="heading-xlarge">Hello <Name firstName={user.firstName}/></h1>
      <SearchForm locations={locations}/>
      <div>
        <h1 className="heading-medium"> Other Tasks </h1>
        <div className="assignment-box">
          <h2 className="heading-medium"> View your assignments </h2>

          <ul className="list-bullet">
            <li>
              <Link className="link" to="/assignments">As Key Worker</Link>
            </li>
          </ul>
        </div>
        {this.userIsKeyworkerAdmin() && this.props.omicUrl
           && <div className="kw-manager-box col-sm-4">
          <a href={this.props.omicUrl} >
            {/*<div className="kw-manager-image" />*/}
            <div className="kw-manager-image-box">
              <img src="/img/manage-key-workers2x.png"/>
            </div>
            <div className="kw-manager-text-box">Manage Key workers</div>
          </a>
        </div>}
      </div>
    </div>;
  }
}

HomePage.defaultProps = {
  loadLocations: () => {},
};

HomePage.propTypes = {
  loadLocations: PropTypes.func,
  locations: PropTypes.array.isRequired,
  omicUrl: PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    test: () => dispatch({ type: LOAD_ASSIGNMENTS, payload: {} }),
    loadLocations: () => dispatch(loadLocations()),
    setOmicUrl: (url) => dispatch(setOmicUrl(url)),
  };
}

const mapStateToProps = createStructuredSelector({
  user: selectUserHomeInfo(),
  locations: selectLocations(),
  omicUrl: selectOmicUrl(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
