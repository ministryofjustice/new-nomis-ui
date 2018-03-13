import axios from 'axios';

export const auth = (state) => (
  axios.create({
    baseURL: 'http://localhost:4040',
    headers: {
      post: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  })
);
