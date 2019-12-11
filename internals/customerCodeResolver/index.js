module.exports = ({ webPackConfig, options }) => {
  const themeLoader = {
    loader: 'sass-resources-loader',
    options: {
      resources: [
        'app/scss/index.scss',
        'app/scss/govuk-elements-sass/public/sass/_govuk-elements.scss',
        'app/scss/govuk_frontend/all.scss',
        'app/scss/bootstrap/bootstrap-mixins.scss',
        'app/scss/bootstrap/bootstrap-grid.scss',
      ],
    },
  }

  const extendedOptions = Object.assign({}, options, { themeLoader })

  return webPackConfig(extendedOptions)
}
