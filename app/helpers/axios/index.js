import axios from 'axios';

export const auth = (state) => (
  axios.create({
    baseURL: 'http://localhost:4040',
    headers: {
      common: { Bearer: state.get('token') },
      post: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  })
);
