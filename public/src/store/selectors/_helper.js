import { createSelectorCreator, defaultMemoize } from 'reselect';
import { is } from 'immutable';

export const createImmutableEqualSelector = createSelectorCreator(defaultMemoize, is);
