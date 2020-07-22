const express = require('express')
const helmet = require('helmet')
const hsts = require('hsts')
const noCache = require('nocache')

const router = express.Router()

const sixtyDaysInSeconds = 5184000

module.exports = () => {
  router.use(helmet())
  router.use(
    hsts({
      maxAge: sixtyDaysInSeconds,
      includeSubDomains: true,
      preload: true,
    })
  )

  // Don't cache dynamic resources (except images which override this)
  router.use(noCache())

  return router
}
