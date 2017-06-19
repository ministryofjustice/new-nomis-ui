import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';

import { CenteredFlexColumn } from 'components/DesktopWrappers';
import { selectDeviceFormat } from 'selectors/app';

import SearchForm from './SearchForm';
import SearchFormMobile from './SearchFormMobile';
import { selectSearchQuery } from '../selectors';

import { selectLocationSelectOptionsAndFilterFunc } from './selectors';
import { SEARCH, SEARCH_SUCCESS, SEARCH_ERROR } from '../constants';

class Search extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    onSubmitForm: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
  }

  render() {
    const { query, deviceFormat } = this.props;
    return (
      <CenteredFlexColumn>
        { deviceFormat === 'desktop' ?
          <SearchForm
            optionsAndFilterFunc={this.props.optionsAndFilterFunc}
            initialValues={query}
            onSubmit={this.props.onSubmitForm}
          />
          :
          <SearchFormMobile
            optionsAndFilterFunc={this.props.optionsAndFilterFunc}
            initialValues={query}
            onSubmit={this.props.onSubmitForm}
          />
        }
      </CenteredFlexColumn>
    );
  }
}

export function mapDispatchToProps() {
  return {
    onSubmitForm: createFormAction((formData) => ({ type: SEARCH, payload: { query: formData.toJS(), resetPagination: true } }), [SEARCH_SUCCESS, SEARCH_ERROR]), //onSubmitActions(SEARCH, SEARCH_SUCCESS, SEARCH_ERROR), // (x) => { console.log(x); }, //

  };
}

Search.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
  optionsAndFilterFunc: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  deviceFormat: PropTypes.string.isRequired,

};

const mapStateToProps = createStructuredSelector({
  query: selectSearchQuery(),
  optionsAndFilterFunc: selectLocationSelectOptionsAndFilterFunc(),
  deviceFormat: selectDeviceFormat(),

});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Search);
