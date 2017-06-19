
// pagination = { perPage: N, pageNumber: M } => [N, N+1, ...,  N+M-1]

// Create a String for indexing the query based on the query object.
export const queryHash = (query) => {
  if (query === 'officerAssignments') return query;
  const hash = `query=${Object.keys(query).map((k) => [k, query[k]].join(':')).join('&')}`;
  return hash;
};
// Create a String for indexing the pagination based on the pagination object.
export const paginationHash = (pagination) => {
  const hash = `page=${Object.keys(pagination).map((k) => [k, pagination[k]].join(':')).join('&')}`;
  return hash;
};

// Helper functions to translate between the original sortedId based on a relative ids + pagination information;
export const originalId = (id, { pageNumber, perPage }) => id + (pageNumber * perPage);
export const idsFromPagination = (pagination) => {
  const N = pagination.pageNumber;
  const M = pagination.perPage;
  const ids = [];
  for (let i = M * N; i < M * (N + 1); i += 1) {
    ids.push(i);
  }
  return ids;
};
