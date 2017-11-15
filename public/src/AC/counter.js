import { INCREMENT } from '../constants';

export function increment() {
  const action = {
    type: INCREMENT
  };

  return action;
}