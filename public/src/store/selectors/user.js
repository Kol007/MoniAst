// import { createImmutableEqualSelector } from './_helper';

export const getUserIsLoadedState = state => state.getIn(['user', 'isLoaded']);
export const getUserIsLoadingState = state => state.getIn(['user', 'isLoading']);
export const getUserIsErrorState = state => state.getIn(['user', 'isError']);
export const getUserIsErrorMsgState = state => state.getIn(['user', 'errorMessage']);
export const getUserErrorFieldState = state => state.getIn(['user', 'errorField']);
export const getUserShouldRedirectState = state => state.getIn(['user', 'shouldRedirect']);
export const getUserIsSubmittedState = state => state.getIn(['user', 'submitSuccess']);

export const getUsersState = state => state.getIn(['user', 'entities']);

export const getUserState = (state, userId) => state.getIn(['user', 'entities', userId]);
