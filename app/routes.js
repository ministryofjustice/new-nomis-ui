// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business

import { getAsyncInjectors } from 'utils/asyncInjectors';
import { logOut, logIn } from 'containers/Authentication/actions'; //eslint-disable-line
// import { s } from 'containers/Authentication/actions';

// logIn
const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

function redirectToLoginGen(store) {
  return (nextState, replace) => {
    if (!store.getState().get('authentication').get('loggedIn')) {
      // // console.log('auto login...');
      // store.dispatch(logIn({ username: 'itag_user', password: '******', redirect: null }));
      // //
      // return;
      // eslint-disable-line no-unreachable
      replace({ // eslint-disable-line no-unreachable
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  };
}


export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  const redirectToLogin = redirectToLoginGen(store);

  return [
    {
      path: '/login',
      name: 'login',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Login'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/logout',
      name: 'logout',
      onEnter: () => {
        // doesn't actually go anywhere, just logs user out.
        // logout saga will lead to a redirect to '/login'.
        store.dispatch(logOut());
      },
    },
    {
      onEnter: redirectToLogin,
      path: '/',
      name: 'homepage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      onEnter: redirectToLogin,
      path: '/mobileMenu',
      name: 'mobileMenu',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/MobileMenu'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      onEnter: redirectToLogin,
      path: '/modalMobile',
      name: 'modalMobile',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/InformationPageMobile'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      onEnter: redirectToLogin,
      path: '/search',
      name: 'search',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Bookings/Search'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('search', reducer.default);
          injectSagas('search', sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      onEnter: redirectToLogin,
      path: '/search/results',
      name: 'search results',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Bookings/Results'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('search', reducer.default);
          injectSagas('search', sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      onEnter: redirectToLogin,
      path: '/bookings/details',
      name: 'search results',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Bookings/details'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('search', reducer.default);
          injectSagas('search', sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      // This MUST be the last object in array
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
