const healthApiFactory = client => {
  const isUp = () => client.get({}, 'ping').then(() => true, () => false)
  return {
    isUp,
  }
}

module.exports = {
  healthApiFactory,
}
