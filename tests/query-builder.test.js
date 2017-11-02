
const QueryBuilder = require('../server/QueryBuilder');


describe('query-build', () => {
  it('should construct an eq query', () => {
    const startDate = '12/12/2017';
    const result = new QueryBuilder('startDate').equals(startDate).build();

    expect(result).toBe(`startDate:eq:${startDate}`);
  });

  it('should construct a query with multiple a eq parameters', () => {
    const startDate = '01/01/2017';
    const endDate = '20/10/2017';

    const result = new QueryBuilder('startDate').equals(startDate).and('endDate').equals(endDate).build();
    expect(result).toBe(`startDate:eq:${startDate}:and:endDate:eq:${endDate}`);
  });

  it('should construct a query with a qteq parameter', () => {
    const startDate = '12/01/2017';
    const result = new QueryBuilder('startDate').greaterThanOrEqual(startDate).build();

    expect(result).toBe(`startDate:gteq:${startDate}`);
  });

  it('should construct a query with a lteq parameter', () => {
    const startDate = '12/01/2017';
    const result = new QueryBuilder('startDate').lessThanOrEqual(startDate).build();

    expect(result).toBe(`startDate:lteq:${startDate}`);
  });
})