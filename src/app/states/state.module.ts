import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// *************************
// Custom Application imports
// *************************
import { userReducer } from './user/user.reducer';

import { UserEffects } from './user';

import { environment } from '../../environments/environment';
export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    EffectsModule.forRoot([
      UserEffects
    ]),

    // Signature matches AppState interface
    StoreModule.forRoot({
      user: userReducer
    }),

    StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  providers: [
      UserEffects
  ],
})
export class AppStateModule { }
