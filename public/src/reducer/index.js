import { combineReducers } from 'redux';
// import { snackbarReducer } from 'react-redux-snackbar';
import count from './counter';
import auth from './auth';
import sip from './sip';
import channels from './channels';
import user from './user';


export default combineReducers({
  // snackbar: snackbarReducer,
  count, auth, sip, channels, user
})