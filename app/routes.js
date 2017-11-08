// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business

import { getAsyncInjectors } from 'utils/asyncInjectors';
import { logOut } from 'containers/Authentication/actions'; //eslint-disable-line
import { setMobileMenuOpen } from 'globalReducers/app';
import { analyticsServiceBuilder } from 'utils/analyticsService';

const analyticsService = analyticsServiceBuilder();

// logIn
const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

const checkAndCloseMobileMenu = (store) => {
  if (store.getState().get('app').get('mobileMenuOpen')) {
    store.dispatch(setMobileMenuOpen(false));
  }
}

const checkAndForceLogout = (store, pathname) => {
  if (store.getState().get('authentication').get('loggedIn') && (pathname === '/login')) {
    store.dispatch(logOut());
  }
}

function onEnterMethodGenerator(store) {
  return (options = { routeName: 'unknown' }) => (nextState, replace) => {
    OnRouteVisit(options.routeName);

    // Any route navigation must close mobile menu if it is open.
    checkAndCloseMobileMenu(store);

    // Any navigation to /login page (e.g. via browser back button) must result in proper logout
    checkAndForceLogout(store, nextState.location.pathname);

    if (options.authRequired && !store.getState().get('authentication').get('loggedIn')) {
      replace({ // eslint-disable-line no-unreachable
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  };
}

const OnRouteVisit = (routeName) => {
  analyticsService.pageView(routeName);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  const onEnter = onEnterMethodGenerator(store);

  return [
    {
      path: '/login',
      name: 'login',
      onEnter: onEnter({ routeName: 'login' }),
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
        // store.dispatch(logOut());
        window.location = '/login';
      },
    },
    {
      path: '/',
      name: 'homepage',
      onEnter: onEnter({ authRequired: true, routeName: 'homepage' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/reducers'),
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, bookingReducers, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectReducer('search', bookingReducers.default);
          injectSagas('search', sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/sessionTimeout',
      name: 'sessionTimeout',
      onEnter: onEnter({ authRequired: false, routeName: 'session timed out' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/SessionTimeout'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/modalMobile',
      name: 'modalMobile',
      onEnter: onEnter({ authRequired: true, routeName: 'modalMobile' }),
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
    },
    {
      path: '/bookings/details/addCaseNote',
      name: 'addCaseNote',
      onEnter: onEnter({ authRequired: true, routeName: 'addCaseNote' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/Details/AddCaseNote'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/amendCaseNote',
      name: 'amendCaseNote',
      onEnter: onEnter({ authRequired: true, routeName: 'amendCaseNote' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/Details/CaseNotes/AmendCaseNoteMobilePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/filterCaseNotes',
      name: 'filterCaseNotes',
      onEnter: onEnter({ authRequired: true, routeName: 'filterCaseNotes' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/Details/CaseNotes/caseNoteFilterFormMobile'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/assignments',
      name: 'assignments',
      onEnter: onEnter({ authRequired: true, routeName: 'assignments' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Assignments'),
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
      path: '/results',
      name: 'search results',
      onEnter: onEnter({ authRequired: true, routeName: 'search results' }),
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
    },
    {
      path: '/bookings/details',
      name: 'search results',
      onEnter: onEnter({ authRequired: true, routeName: 'booking details' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Bookings/Details'),
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
      path: '/bookings',
      name: 'search results',
      onEnter: onEnter({ authRequired: true, routeName: 'search results' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Bookings/Details'),
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
      onEnter: onEnter({ routeName: 'notfound' }),
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
