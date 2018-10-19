import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LOAD_ASSIGNMENTS } from 'containers/Assignments/constants';
import ActionLinks from 'components/ActionLinks';
import SearchForm from './SearchForm';

import {
  loadLocations,
} from '../Bookings/actions';


import './homepage.scss';

class HomePage extends Component {

  componentDidMount() {
    const { loadLocations } = this.props;
    loadLocations();
  }

  render() {
    const { user, locations, omicUrl, whereaboutsUrl, establishmentRollcheckUrl } = this.props;
    if (!user) {
      return <div />
    }

    return (<div>
      <h1 className="heading-xlarge">Welcome back</h1>
      <SearchForm locations={locations} />
      <div>
        <ActionLinks
          className="no-left-gutter"
          isKeyWorkerAdmin={user.isKeyWorkerAdmin}
          isKeyWorker={user.isKeyWorker}
          isWhereabouts={user.isWhereabouts}
          omicUrl={omicUrl}
          whereaboutsUrl={whereaboutsUrl}
          establishmentRollcheckUrl={establishmentRollcheckUrl}
        />

      </div>
    </div>);
  }
}

HomePage.defaultProps = {
  loadLocations: () => {},
};

HomePage.propTypes = {
  loadLocations: PropTypes.func,
  locations: PropTypes.array.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    test: () => dispatch({ type: LOAD_ASSIGNMENTS, payload: {} }),
    loadLocations: () => dispatch(loadLocations()),
  };
}


const mapStateToProps = (state) => {
  const user = state.getIn(['authentication','user']);
  const locations = state.getIn(['home', 'locations']).toJS();
  const omicUrl = state.getIn(['app', 'omicUrl']);
  const whereaboutsUrl = state.getIn(['app', 'whereaboutsUrl']);
  const establishmentRollcheckUrl = state.getIn(['app', 'establishmentRollcheckUrl']);

  return {
    user,
    locations,
    omicUrl,
    whereaboutsUrl,
    establishmentRollcheckUrl,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
