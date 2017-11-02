class QueryBuilder {
  constructor(fieldName) {
    this.query = [fieldName];
    this.equals = this.equals.bind(this);
    this.build = this.build.bind(this);
  }

  equals(value) {
    this.query.push(`:eq:${value}`);
    return this;
  }

  greaterThanOrEqual(value) {
    this.query.push(`:gteq:${value}`);
    return this;
  }

  lessThanOrEqual(value) {
    this.query.push(`:lteq:${value}`);
    return this;
  }

  and(fieldName) {
    this.query.push(':and:');
    this.query.push(fieldName);
    return this;
  }

  build() {
    return this.query.join('');
  }
}

module.exports = QueryBuilder;