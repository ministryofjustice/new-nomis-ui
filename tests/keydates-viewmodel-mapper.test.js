require('sinon');
const chai = require('chai'),
  expect = chai.expect;

const mapper = require('../server/view-model-mappers/sentenceKeyDates');

describe('Sentence key dates viewModel mapper', () => {
  it('should display dto release dates in order of precedence when dto sentence rule applies ', () => {
    const data = {
      bookingId: 0,
      sentenceStartDate: '2017-10-03',
      additionalDaysAwarded: 0,
      sentenceExpiryDates: '2017-10-03',
      earlyTermDate: '2017-10-03',
      midTermDate: '2017-10-03',
      lateTermDate: '2017-10-03',
    }

    const sentence = mapper(data);

    expect(sentence.dtoReleaseDates[0].label).to.equal('Early term date');
    expect(sentence.dtoReleaseDates[0].value).to.equal(data.earlyTermDate);

    expect(sentence.dtoReleaseDates[1].label).to.equal('Mid term date');
    expect(sentence.dtoReleaseDates[1].value).to.equal(data.midTermDate);

    expect(sentence.dtoReleaseDates[2].label).to.equal('Late term date');
    expect(sentence.dtoReleaseDates[2].value).to.equal(data.lateTermDate);
  });

  it('should not populate the view model with sentence data when date values are empty when dto rules apply', () => {
    const data = {
      bookingId: 0,
      sentenceStartDate: '2017-10-03',
      additionalDaysAwarded: 0,
      sentenceExpiryDates: '2017-10-03',
      earlyTermDate: '2017-10-03',
      lateTermDate: '2017-10-03',
    }

    const sentence = mapper(data);

    expect(sentence.dtoReleaseDates[0].label).to.equal('Early term date');
    expect(sentence.dtoReleaseDates[0].value).to.equal(data.earlyTermDate);

    expect(sentence.dtoReleaseDates[1].label).to.equal('Late term date');
    expect(sentence.dtoReleaseDates[1].value).to.equal(data.lateTermDate);
  })

  it('should change the label from "sentence expiry date" to "DTO expiry date" when the dto rules apply', () => {
    const data = {
      bookingId: 0,
      sentenceStartDate: '2017-10-03',
      additionalDaysAwarded: 0,
      sentenceExpiryDates: '2017-10-03',
      earlyTermDate: '2017-10-03',
    };

    const sentence = mapper(data);

    expect(sentence.sentenceExpiryDates[0].label).to.equal('DTO expiry date');
    expect(sentence.sentenceExpiryDates[0].value).to.equal(data.sentenceExpiryDates);
  });

  it('should populate the view model with the correct label and value the non dto release date', () => {
    const data = {
      bookingId: 0,
      sentenceStartDate: '2017-10-03',
      additionalDaysAwarded: 0,
      sentenceExpiryDates: '2017-10-03',
      earlyTermDate: '2017-10-03',
      lateTermDate: '2017-10-03',
      nonDtoReleaseDate: '2017-10-03',
      nonDtoReleaseDateType: 'ARD',
    }

    const sentence = mapper(data);

    expect(sentence.nonDtoReleaseDate.label).to.equal(data.nonDtoReleaseDateType);
    expect(sentence.nonDtoReleaseDate.value).to.equal(data.nonDtoReleaseDate);
  });

  it('should display the Sentence expiry date with the label of "Sentence expiry date" when the non dto rules apply', () => {
    const data = {
      bookingId: 0,
      sentenceStartDate: '2017-10-03',
      additionalDaysAwarded: 0,
      sentenceExpiryDates: '2017-10-03',
      nonDtoReleaseDate: '2017-10-03',
      nonDtoReleaseDateType: 'ARD',
    }

    const sentence = mapper(data);

    expect(sentence.sentenceExpiryDates[0].label).to.equal('Sentence expiry date');
    expect(sentence.sentenceExpiryDates[0].value).to.equal(data.sentenceExpiryDates);
  });

  it('should display dto expiry date and sentence expiry date when both dto and non dto rules apply', () => {
    const data = {
      bookingId: 0,
      sentenceStartDate: '2017-10-03',
      additionalDaysAwarded: 0,
      sentenceExpiryDates: '2017-10-03',
      earlyTermDate: '2017-10-03',
      lateTermDate: '2017-10-03',
      nonDtoReleaseDate: '2017-10-03',
      nonDtoReleaseDateType: 'ARD',
    }

    const sentence = mapper(data);

    expect(sentence.sentenceExpiryDates[0].label).to.equal('DTO expiry date');
    expect(sentence.sentenceExpiryDates[0].value).to.equal(data.sentenceExpiryDates);

    expect(sentence.sentenceExpiryDates[1].label).to.equal('Sentence expiry date');
    expect(sentence.sentenceExpiryDates[1].value).to.equal(data.sentenceExpiryDates);
  });
});