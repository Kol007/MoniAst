// import { createImmutableEqualSelector } from './_helper';

export const getAuthSipState = state => state.getIn(['auth', 'sip']);

export const getAuthIsLoggedInState = state => state.getIn(['auth', 'isLoggedIn']);

export const getAuthIsLoadingInState = state => state.getIn(['auth', 'isLoading']);

export const getAuthIsErrorState = state => state.getIn(['auth', 'isError']);

export const getAuthErrorCodeState = state => state.getIn(['auth', 'errorCode']);

export const getAuthErrorMessageState = state => state.getIn(['auth', 'errorMessage']);
