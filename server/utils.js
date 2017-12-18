

const groupBy = (property,array) => array.reduce((result,current) => {
  const date = current[property];
  if (!result[date]) { result[date] = []; }

  result[date].push(current);

  return result;
},[]);


module.exports = {
  groupBy,
}