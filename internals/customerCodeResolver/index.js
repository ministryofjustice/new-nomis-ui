

module.exports = (options,configBuilder) => {
  const getThemePath = (env) => `app/customers/${env.CLIENT}/index.scss`;
  const getHeaderComponent = (env) => `customers/${env.CLIENT}/app/containers/Header/index.js`;

  const themeLoader = {
    loader: 'sass-resources-loader',
    options: {
      resources: [
        getThemePath(process.env),
        'app/scss/govuk-elements-sass/public/sass/_govuk-elements.scss',
        'app/scss/bootstrap/bootstrap-feature-select-nomis.scss',
      ],
    },
  };

  const componentSubstitutes = {
    header: getHeaderComponent(process.env),
  };

  const extendedOptions = Object.assign({}, options, { themeLoader }, { componentSubstitutes });
  return configBuilder(extendedOptions);
};