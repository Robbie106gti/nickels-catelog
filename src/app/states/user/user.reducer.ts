
import { AppState } from '../state';

import * as userActions from './user.actions';
import { User } from './user';

export type Action = userActions.All;
/**
 * Define all store queries for Post(s)
 */
export namespace UsersQuery {
    export const getUser = (state: AppState) => state.user;
  }

// Reducer
export function userReducer(
    state: User,
    action: Action) {

    switch (action.type) {

    case userActions.GET_USER:
    return { ...state, loading: true };

    case userActions.AUTHENTICATED:
        return { ...state, ...action.payload, loading: false };

    case userActions.NOT_AUTHENTICATED:
        return { ...state, loading: false };

    case userActions.LOGIN:
      return { ...state, loading: true };

    case userActions.AUTH_ERROR:
      return { ...state, ...action.payload, loading: false };

    case userActions.LOGOUT:
      return { ...state, loading: true };

    default:
      return state;
    }
}
