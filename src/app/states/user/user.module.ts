import { NgModule } from '@angular/core';
import { UserProfileComponent } from './profile/user-profile.component';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './user.reducer';
import { UserEffects } from './user.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('user', userReducer),
    EffectsModule.forFeature([UserEffects])
  ],
  exports: [UserProfileComponent],
  declarations: [UserProfileComponent]
})
export class UserModule { }
