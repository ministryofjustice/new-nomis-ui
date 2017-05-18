// Fires on store subscribe
function save(store) {
  try {
    // Define what to save
    const state = {
      login: store.getState().get('login'),
    };

    const serializedState = JSON.stringify(state);
    localStorage.setItem('ig_user', serializedState);
    return true;
  } catch (err) {
    // TODO console.log('save state failed', err);
    return false;
  }
}

function load() {
  try {
    const serializedState = localStorage.getItem('ig_user');
    if (serializedState === null) return undefined;
    const state = { ...JSON.parse(serializedState) };
    state.login.validated = false;
    return state;
  } catch (err) {
    // TODO console.log('loading state failed', err);
    return undefined;
  }
}

export default {
  save,
  load,
};
