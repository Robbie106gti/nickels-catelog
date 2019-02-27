import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { User, IUser } from './user';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { switchMap, mergeMap, map } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';
import { defer } from 'rxjs/observable/defer';

import { AppState } from '../state';
import { UsersQuery } from './user.reducer';

import * as actions from './user.actions';
import { Login } from '../../home/login';
import { extend } from 'lodash';

type Action = actions.All;

@Injectable()
export class UserEffects {
    wqlogin: Login;
    iUser: Observable<any>;
    user: IUser;
    endpoint = 'https://us-central1-nickels-catalog.cloudfunctions.net/auth';

  // ************************************************
  // Observable Queries available for consumption by views
  // ************************************************
  user$ = this.store.select(UsersQuery.getUser);

  // ************************************************
  // Effects to be registered at the Module level
  // ************************************************

@Effect()
getCookie$: Observable<Action> = this.actions$.ofType(actions.GET_COOKIE)
  .map((action: actions.GetCookie) => {
    let cookie = this.getCookie('username');
      if (cookie !== '') {
          /// User logged in
          cookie = JSON.parse(cookie);
          return this.userCheck(cookie);
      } else {
          /// User not logged in
          return null;
      }
  })
  .map(res => {
      if (res !== null) {
          /// User logged in
          console.log(this.iUser);
          return new actions.Authenticated(this.iUser);
      } else {
          /// User not logged in
          console.log('res is null' + res);
          return new actions.NotAuthenticated();
      }
  });

  @Effect()
    getUser$: Observable<Action> = this.actions$.ofType(actions.GET_USER)
      .map((action: actions.GetUser) => {
        let cookie = this.getCookie('username');
          if (cookie !== '') {
              /// User logged in
              cookie = JSON.parse(cookie);
              this.userCheck(cookie);
              let id;
              this.iUser.subscribe(obj => {
                console.log(obj);
                id = obj;
              });
              if (id.email) {
                return id;
              }
          } else {
              /// User not logged in
              return null;
          }
      })
      .map(res => {
        if (res !== null) {
            /// User logged in
            console.log(res);
            return new actions.Authenticated(res);
        } else {
            /// User not logged in
            console.log('res is null' + res);
            return new actions.NotAuthenticated();
        }
      });

/** Login */
@Effect()
login$: Observable<Action> = this.actions$.ofType(actions.LOGIN)
  .map((action: actions.Login) => action.payload)
  .map( credential => {
      // successful login
      return new actions.GetUser();
  });

@Effect()
  logout$: Observable<Action> = this.actions$.ofType(actions.LOGOUT)
  .map((action: actions.Logout) => action.payload )
  .map( () => {
      return new actions.NotAuthenticated();
  });

@Effect({dispatch: false})
  init$: Observable<any> = defer(() => {
    this.store.dispatch(new actions.GetUser());
  });

constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  login(obj): Observable<User> {
    this.store.dispatch(new actions.Login(obj));
    return this.user$;
  }

  logout(): Observable<User> {
    this.store.dispatch(new actions.Logout());
    return this.user$;
  }

  userCheck(obj) {
    if (!obj.email) { return ''; }
    this.iUser = this.afs.doc<IUser>(`users/${obj['email']}`).valueChanges();
    return this.iUser;
  }

  webquoin(userlogin) {
    const webq = this.http.post(this.endpoint, userlogin)
    .subscribe(Response => {
        const fname = this.trimit(Response['valid'].FirstName);
        const lname = this.trimit(Response['valid'].LastName);
        const email = this.trimit(Response['valid'].Email);
        const obj = {
          id: email,
          status: 'online',
          class: this.trimit(Response['valid'].DealerID),
          dealerName: this.trimit(Response['valid'].DealerName),
          displayName: this.trimit(Response['valid'].DisplayName),
          firstName: fname,
          lastName: lname,
          email: email,
          fullName: fname + ' ' + lname,
          username: this.trimit(Response['valid'].UserName),
          roles: {
            reader: true
          }
        };
        this.setCookie(obj, 7);
        this.userCheck(obj);
    });
 }

  trimit(str) {
    str = str.trim();
    return str;
  }

  setCookie(data, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    const cookie = JSON.stringify({
      class: data.class,
      email: data.email
    });
    document.cookie = 'username=' + cookie + ';' + expires + ';path=/';
  }

  getCookie(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
  }
}
