const path = require('path');
const fs = require('fs');


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

  Object.keys(componentSubstitutes).forEach(key => {
    const filePath = path.join(__dirname,'../../app',componentSubstitutes[key]);
    if (fs.existsSync(filePath) === false) {
      const error = `Required file not found - ${filePath}`;
      throw error;
    }
  });

  const extendedOptions = Object.assign({},
    options,
    { themeLoader },
    { componentSubstitutes });

  return webPackConfig(extendedOptions);
};