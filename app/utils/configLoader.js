import axios from 'axios';
import yaml from 'js-yaml';

export const loadConfig = () => axios.get('/config.yaml')
  .then((response) => yaml.safeLoad(response.data));
