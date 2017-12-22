import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Login } from './login';
import { Store } from '@ngrx/store';
import * as actions from '../states/user/user.actions';
import * as fromUser from '../states/user/user.reducer';
import { User } from '../states/user';
import { UserEffects } from '../states/user/user.effects';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  user: Login;
  user$: Observable<User> = this.userService.user$;

  constructor(private userService: UserEffects) {  }

  ngOnInit() {
    this.userService.checkCookie();
    this.loginForm = new FormGroup ({
      username: new FormControl( '', {
        validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(25)],
        updateOn: 'blur' }),
      password: new FormControl( '', {
        validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(25)],
        updateOn: 'submit' })
    });
  }

  logout() {
    this.userService.logout();
  }

  onSubmit(loginForm, event) {
    if (this.loginForm.valid) {
      this.user = this.loginForm.value;
    const data = {
      username: this.user.username,
      password: this.user.password
      };
    // this.userService.login(data);
    }
  }
}
