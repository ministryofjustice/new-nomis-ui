import axios from 'axios'

export default function updateApplicationWatcher() {
  axios.interceptors.response.use(
    config => {
      if (config.status === 205) {
        alert("There is a newer version of this website available, click ok to ensure you're using the latest version.") // eslint-disable-line no-alert
        window.location = '/logout'
      }

      return config
    },
    error => Promise.reject(error)
  )
}
