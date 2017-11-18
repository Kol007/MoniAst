import { combineReducers } from 'redux';
// import { snackbarReducer } from 'react-redux-snackbar';
import auth from './auth';
import sip from './sip';
import channels from './channels';
import user from './user';

export default combineReducers({
  // snackbar: snackbarReducer,
  auth,
  sip,
  channels,
  user
});
