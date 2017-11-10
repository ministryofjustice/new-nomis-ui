
const longName = (label) => ({
  ARD: 'Automatic release date',
  CRD: 'Conditional release date',
  NPD: 'Non-parole date',
  PRRD: 'Post-recall release date',
  HDCED: 'Home det. eligibility',
  PED: 'Parole eligibility',
  HDCAD: 'Home det. actual',
  APD: 'Approved parole date',
  ROTL: 'Release on temp. licence',
  ERSED: 'Early removal scheme eligibility',
  LED: 'Licence expiry date',

}[label] || label);

const labelValue = ({ label,value }) => value && { label, value };
const removeBlankEntries = (array) => array.filter(value => !!value);

const otherDates = (data) => Object.assign({}, {
  dates: removeBlankEntries([
    labelValue({ label: longName('HDCED'), value: data.homeDetentionCurfewEligibilityDate }),
    labelValue({ label: longName('PED'), value: data.paroleEligibilityDate }),
    labelValue({ label: longName('HDCAD'), value: data.homeDetentionCurfewActualDate }),
    labelValue({ label: longName('APD'), value: data.approvedParoleDate }),
    labelValue({ label: longName('ROTL'), value: data.releaseOnTemporaryLicenceDate }),
    labelValue({ label: longName('ERSED'), value: data.earlyReleaseSchemeEligibilityDate }),
    labelValue({ label: longName('LED'), value: data.licenceExpiryDate }),
  ]),
});

const sentence = (data) => {
  const isDto = () => !!data.earlyTermDate || !!data.midTermDate || !!data.lateTermDate;
  const isNonDto = () => !!data.nonDtoReleaseDate;

  return Object.assign({}, isDto &&
    {
      startDate: data.sentenceStartDate,
      additionalDaysAwarded: data.additionalDaysAwarded,
      dtoReleaseDates: removeBlankEntries([
        labelValue({ label: 'Early term date', value: data.earlyTermDate }),
        labelValue({ label: 'Mid term date', value: data.midTermDate }),
        labelValue({ label: 'Late term date', value: data.lateTermDate }),
      ]),
      nonDtoReleaseDate: isNonDto() && labelValue({
        label: longName(data.nonDtoReleaseDateType),
        value: data.nonDtoReleaseDate,
      }),
      sentenceExpiryDates: removeBlankEntries([
        isDto() && labelValue({
          label: 'DTO expiry date',
          value: data.sentenceExpiryDates,
        }),
        isNonDto() && labelValue({
          label: 'Sentence expiry date',
          value: data.sentenceExpiryDates,
        }),
      ]),
    });
};

module.exports = {
  otherDates,
  sentence,
};