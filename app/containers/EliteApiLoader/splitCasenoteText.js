
const parseAmendmentInfo = (info) => {
  const splitInfo = info.slice(4, info.length - 1).split(' ');
  const userId = splitInfo[0];
  const date = splitInfo[6];
  const time = splitInfo[7];
  return { key: [userId, date, time].join('-'), userId, date, time, dateTime: `${date} ${time}` };
};
const generateAmendmentData = (infoString, text) => ({
  ...parseAmendmentInfo(infoString),
  text,
  stub: stubify(text, 50),
});
const stubify = (text, n) => {
  const short = text.substr(0, n - 3);
  if (/^\S/.test(text.substr(n))) { return short.replace(/\s+\S*$/, '...'); }
  return short;
};

const splitCaseNoteText = (caseNoteText) => {
  if (!caseNoteText) {
    return { caseNote: '', stub: '' };
  }
  const regex = /\.\.\.\[\w+ updated the case notes* on [0-9-/ :]*\]/g;
  const amendmentBreaks = caseNoteText.match(regex);
  if (!amendmentBreaks) {
    return { caseNote: caseNoteText, stub: stubify(caseNoteText, 100) };
  }
  const map = amendmentBreaks.reduce((acc, midSection, index) => {
    const string = acc.string.split(midSection);

    if (index === amendmentBreaks.length - 1) {
      if (index === 0) {
        // This was the only amendment.
        return { caseNote: string[0], stub: stubify(string[0], 100), amendments: [generateAmendmentData(midSection, string[1])] };
      }
      return { caseNote: acc.caseNote, stub: stubify(acc.caseNote, 100), amendments: acc.amendments.concat([generateAmendmentData(acc.lastMid, string[0]), generateAmendmentData(midSection, string[1])]) };
    }

    if (acc.lastMid) {
      return { string: string[1], lastMid: midSection, caseNote: acc.caseNote, amendments: acc.amendments.concat([generateAmendmentData(acc.lastMid, string[0])]) };
    }
    return { caseNote: string[0], string: string[1], lastMid: midSection, amendments: [] };
  }, { string: caseNoteText });

  return map;
};

export default splitCaseNoteText;
