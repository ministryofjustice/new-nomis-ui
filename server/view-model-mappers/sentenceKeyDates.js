
module.exports = (data) => {
  const isDto = () => !!data.earlyTermDate || !!data.midTermDate || !!data.lateTermDate;
  const isNonDto = () => !!data.nonDtoReleaseDate;

  const labelValue = ({ label,value }) => value && { label, value };
  const removeBlankEntries = (array) => array.filter(value => !!value);

  return Object.assign({}, isDto &&
    {
      startDate: data.sentenceStartDate,
      additionalDaysAwarded: data.additionalDaysAwarded,
      dtoReleaseDates: removeBlankEntries([
        labelValue({ label: 'Early term date', value: data.earlyTermDate }),
        labelValue({ label: 'Mid term date', value: data.midTermDate }),
        labelValue({ label: 'Late term date', value: data.lateTermDate }),
      ]),
      nonDtoReleaseDate: isNonDto() && labelValue({ label: data.nonDtoReleaseDateType, value: data.nonDtoReleaseDate }),
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
}