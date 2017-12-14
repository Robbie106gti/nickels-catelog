import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { User } from './user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  user: User;

  constructor() {  }

  ngOnInit() {
    this.loginForm = new FormGroup ({
      username: new FormControl( '', {
        validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(25)],
        updateOn: 'blur' }),
      password: new FormControl( '', {
        validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(25)],
        updateOn: 'submit' })
    });
  }

  onSubmit(loginForm, event) {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
    // https://plnkr.co/edit/IyF29oM1TyPpjU9ohEMc?p=preview
    // https://www.toptal.com/angular-js/angular-4-forms-validation
    // https://github.com/bradtraversy/angularfs/blob/master/src/app/components/add-item/add-item.component.ts
    // https://www.youtube.com/watch?v=cwqeyOFcaoA
  }
}
