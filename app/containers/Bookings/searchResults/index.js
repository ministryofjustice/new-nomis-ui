import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { CenteredFlexColumn } from 'components/DesktopWrappers';

import { selectSearchResults } from '../selectors';


const displaySearchResult = (inmate) => <div key={inmate.bookingId}>name: {inmate.firstName} {inmate.lastName}</div>;

class SearchResults extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    results: PropTypes.array.isRequired,
  }

  render() {
    // const locations = [{ title: 'testing - 1 2 3', value: '123' },
    //                    { title: 'testing - 2 3 4', value: '234' },
    //                    { title: 'testing - 4 5 6', value: '345' }];
    return (
      <CenteredFlexColumn>
        {this.props.results ? this.props.results.map(displaySearchResult) : null}
      </CenteredFlexColumn>
    );
  }
}

export function mapDispatchToProps() {
  return {
    // onSubmitForm: createFormAction((payload) => ({ type: SEARCH, payload }), [SEARCH_SUCCESS, SEARCH_ERROR]), //onSubmitActions(SEARCH, SEARCH_SUCCESS, SEARCH_ERROR), // (x) => { console.log(x); }, //
  };
}

const mapStateToProps = createStructuredSelector({
  results: selectSearchResults(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
