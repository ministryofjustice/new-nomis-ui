import React,{ Component } from 'react';
import { FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  selectBookingDetailsId,
  selectKeyDatesViewModel,
  selectError,
} from '../../selectors'

import {
  loadKeyDates,
} from '../../actions';

import './index.scss';

const KeyDatePair = ({ title, text, date }) => (
  <div className="information">
  <label>
    {title}
   </label>
  <span>
    { text && <b>{text}</b> }
    { date &&
    <b>
      <FormattedDate value={date} />
    </b>}
  </span>
</div>)

const ErrorMessage = () => (<div>
  <div className="error-summary">
    <div className="error-message">
      There was a problem trying to retrieve the key dates information.
    </div>
  </div>
</div>)


const SentenceView = ({ startDate, additionalDaysAwarded, dtoReleaseDates, nonDtoReleaseDate, sentenceExpiryDates }) => {
  const shouldShowNonDtoReleaseDate = nonDtoReleaseDate && nonDtoReleaseDate.label && nonDtoReleaseDate.value;

  return (<div>
    <b className="bold">
      Sentence key dates
    </b>

    <div className="section">

      <div className="information-group">
        <KeyDatePair title="Start date" date={startDate} />
        { (dtoReleaseDates || []).map(pair => <KeyDatePair title={pair.label} date={pair.value} />)}
        <KeyDatePair title=" Additional days awarded" text={additionalDaysAwarded} />
      </div>
      <div className="information-group">
        { (sentenceExpiryDates || []).map(pair => <KeyDatePair title={pair.label} date={pair.value} />)}
        { shouldShowNonDtoReleaseDate && <KeyDatePair title={nonDtoReleaseDate.label} date={nonDtoReleaseDate.value} /> }
      </div>
    </div>
  </div>)
}

class KeyDates extends Component {
  componentDidMount() {
    const { bookingId,loadContent } = this.props;

    loadContent(bookingId);
  }
  render() {
    const { viewModel, error } = this.props;

    if (error) { return <ErrorMessage /> }
    if (!viewModel) { return <div>Loading....</div> }

    const { iepLevel, daysSinceReview, sentence, other } = viewModel && viewModel.toJS();
    const { crd, ped, led, hdcEligibilityDate } = other || {};

    return (
        <div className="key-dates">

         <div>
            <b className="bold">
              Incentives and earned privileges
            </b>

            <div className="section">
              <div className="information-group">
                <KeyDatePair title="IEP Level" text={iepLevel} />
                <KeyDatePair title="Days since review" text={daysSinceReview} />
              </div>
            </div>
          </div>

          { sentence && <SentenceView {...sentence} /> }

          { other && (
            <div>
              <b className="bold">
                Other dates
              </b>

              <div className="section">

                <div className="information-group">
                  <KeyDatePair title="CRD" text={crd} />
                  <KeyDatePair title="PED" date={ped} />
                </div>

                <div className="information-group">
                  <KeyDatePair title="LED" date={led} />
                  <KeyDatePair title="HDC eligibility date" text={hdcEligibilityDate} />
                </div>

              </div>
            </div>
          )}

        </div>
    )
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    loadContent: (id) => dispatch(loadKeyDates(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  bookingId: selectBookingDetailsId(),
  viewModel: selectKeyDatesViewModel(),
  error: selectError(),
});

export default connect(mapStateToProps, mapDispatchToProps)(KeyDates);

