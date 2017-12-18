
module.exports = (entry) => {
  const comment = getComment(entry);
  return {
    type: (entry.eventSubType === 'PA' && entry.eventSourceDesc) || entry.eventSubTypeDesc,
    comment,
    shortComment: comment && comment.length > 40 ? `${comment.substring(0, 40)}...` : comment,
    startTime: entry.startTime,
    endTime: entry.endTime,
  }
};

const getComment = (entry) => entry.eventSubType === 'PA' ? null : entry.eventSourceDesc;