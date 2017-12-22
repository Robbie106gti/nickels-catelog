import { ActionReducerMap } from '@ngrx/store';
import { userReducer } from './user/user.reducer';

export const reducers: ActionReducerMap<any> = {
    user: userReducer
};
