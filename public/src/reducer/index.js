import { combineReducers } from 'redux';
import auth from './auth';
import sip from './sip';
import queue from './queue';
import channels from './channels';
import user from './user';

export default combineReducers({
  auth,
  sip,
  queue,
  channels,
  user
});
