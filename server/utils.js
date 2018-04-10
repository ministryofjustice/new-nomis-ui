

const groupBy = (property,array) => array.reduce((result,current) => {
  const date = current[property];
  if (!result[date]) { result[date] = []; }

  result[date].push(current);

  return result;
},[]);

const extractProperties = (properties, data) => properties
    .filter(p => data[p])
    .reduce((previous, current) => ({
      ...previous,
      [current]: data[current],
    }), {});


module.exports = {
  groupBy,
  extractProperties,
};