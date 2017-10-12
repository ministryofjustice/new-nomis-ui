

module.exports = ({ webPackConfig,options }) => {
  const themeLoader = {
    loader: 'sass-resources-loader',
    options: {
      resources: [
        `app/customers/${process.env.CLIENT}/index.scss`,
        'app/scss/govuk-elements-sass/public/sass/_govuk-elements.scss',
        'app/scss/bootstrap/bootstrap-mixins.scss',
        'app/scss/bootstrap/bootstrap-grid.scss',
      ],
    },
  };

  const componentSubstitutes = {
    header: `customers/${process.env.CLIENT}/app/components/Header/index.js`,
    'product-globals': `customers/${process.env.CLIENT}/app/product-globals.js`,
  };

  const extendedOptions = Object.assign({},
    options,
    { themeLoader },
    { componentSubstitutes });

  return webPackConfig(extendedOptions);
};