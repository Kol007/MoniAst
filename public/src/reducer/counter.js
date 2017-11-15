import { INCREMENT } from '../constants';
import expect, { createSpy, spyOn, isSpy } from 'expect';

const counter = (count = 0, action) => {
  return action.type == INCREMENT ? count + 1 : count;
};

export default counter;


expect(
  counter(undefined, { type: INCREMENT })
).toEqual(1)

expect(
  counter(4, { type: INCREMENT })
).toEqual(5)
expect(
  counter(4, { type: 'wrong' })
).toEqual(4)

console.log('Counter tests passed!')
