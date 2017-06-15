import React from 'react';
import PropTypes from 'prop-types';

function JsonBlock({ json }) {
  return (
    <div style={{ whiteSpace: 'pre-wrap', margin: '10px', padding: '10px', border: 'solid 1px lightgrey' }}>{JSON.stringify(json, null, '\t')}</div>
  );
}

JsonBlock.propTypes = {
  json: PropTypes.object,
};

JsonBlock.defaultProps = {
  json: {},
};

export default JsonBlock;
