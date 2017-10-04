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
    { (text || date) && (
      <label>
        {title}
      </label>
    ) }
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

  if (
    !startDate &&
    !additionalDaysAwarded &&
    !nonDtoReleaseDate) {
    return <div></div>
  }

  return (<div>
    <b className="bold">
      Sentence key dates
    </b>

    <div className="section">

      <div className="information-group">
        <KeyDatePair title="Start date" date={startDate} />
        { (dtoReleaseDates || []).map(pair => <KeyDatePair key={pair.label} title={pair.label} date={pair.value} />)}
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
    const shouldShowOtherDates = other && other.dates && other.dates.length > 0;

    return (
        <div className="key-dates">

         <div>
            <b className="bold">
              Incentives and earned privileges
            </b>

            <div className="section">
              <div className="information-group">

                <div className="information">
                  <label>
                      IEP Level
                  </label>
                  <span>
                    {iepLevel}
                  </span>
                </div>

                <div className="information">
                  <label>
                    Days since review
                  </label>
                  <span>
                    {daysSinceReview}
                  </span>
                </div>

              </div>
            </div>
          </div>

          { sentence && <SentenceView {...sentence} /> }

          { shouldShowOtherDates && (
            <div>
              <b className="bold">
                Other dates
              </b>

              <div className="section">

                <div className="information-group">
                  {other.dates.map(otherDate => <KeyDatePair key={otherDate.label} title={otherDate.label} date={otherDate.value} />)}
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

