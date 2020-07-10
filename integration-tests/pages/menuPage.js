const page = require('./page')

const menuPage = () => page('Tasks', {})

export default {
  verifyOnPage: menuPage,
}
