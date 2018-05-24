// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business

import { getAsyncInjectors } from 'utils/asyncInjectors';
import { logOut } from 'containers/Authentication/actions'; //eslint-disable-line
import { setMobileMenuOpen } from 'globalReducers/app';
import { analyticsServiceBuilder } from 'utils/analyticsService';
import { push } from 'react-router-redux';

const analyticsService = analyticsServiceBuilder();

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

const isKeyWorker = (store) => {
  const state = store.getState();
  const user = state.getIn(['authentication', 'user']);
  
  return user && user.isKeyWorker;
}

function onEnterMethodGenerator(store) {
  return (options = { routeName: 'unknown', canAccess: null }) => () => {
    if (options.canAccess && options.canAccess(store) === false) {
      store.dispatch(push('/'));
      return;
    }

    OnRouteVisit(options.routeName);

    // Any route navigation must close mobile menu if it is open.
    checkAndCloseMobileMenu(store);
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
      path: '/',
      name: 'homepage',
      onEnter: onEnter({ routeName: 'homepage' }),
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
      path: '/offenders/:offenderNo/addCaseNote',
      name: 'addCaseNote',
      onEnter: onEnter({ routeName: 'addCaseNote' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Bookings/Details/AddCaseNote'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([bookingReducers, sagas, component]) => {
          injectReducer('search', bookingReducers.default);
          injectSagas('search', sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/myKeyWorkerAllocations',
      name: 'my key worker allocations',
      onEnter: onEnter({ routeName: 'my key worker allocations', canAccess: isKeyWorker }),
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
      onEnter: onEnter({ routeName: 'search results' }),
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
      path: '/offenders/:offenderNo/schedule',
      name: 'schedule',
      onEnter: onEnter({ routeName: 'scheduled 7 day view' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Bookings/Details/Scheduled'),
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
      path: '/offenders/:offenderNo/addAppointment',
      name: 'AddAppointment',
      onEnter: onEnter({ routeName: 'Add appointment' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/reducers'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/Bookings/Details/AddAppointment'),
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
      path: '/offenders/:offenderNo/case-notes/:caseNoteId/amendCaseNote',
      name: 'amendCaseNote',
      onEnter: onEnter({ routeName: 'amendCaseNote' }),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Bookings/Details/CaseNotes/AmendCaseNote'),
          System.import('containers/Bookings/sagas'),
          System.import('containers/EliteApiLoader/reducer'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component, sagas, reducer]) => {
          injectSagas('search', sagas.default);
          injectReducer('search', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/offenders/:offenderNo(/:activeTab)(/:itemId)',
      name: 'search results',
      onEnter: onEnter({ routeName: 'offender details' }),
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
      onEnter: onEnter({ routeName: 'search results' }),
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
