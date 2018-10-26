import ReactGA from 'react-ga'

export default () => {
  let initialized = false

  const initialize = () => {
    if (initialized === false) {
      const element = document.getElementById('google-analytics-id')
      const id = element && element.value
      if (id) {
        ReactGA.initialize(id)
        initialized = true
      }
    }
  }

  return {
    pageView: page => {
      initialize()
      ReactGA.pageview(page)
    },
  }
}
