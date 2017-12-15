import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { User } from './user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  user: User;
  cats: any;
  endpoint = 'https://us-central1-nickels-catalog.cloudfunctions.net/auth';
  catelog = 'https://webquoin.com/catalog/build/json/';

  constructor(private http: HttpClient) {  }

  ngOnInit() {
    this.loginForm = new FormGroup ({
      username: new FormControl( '', {
        validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(25)],
        updateOn: 'blur' }),
      password: new FormControl( '', {
        validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(25)],
        updateOn: 'submit' })
    });
    this.getCat();
  }

  onSubmit(loginForm, event) {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.user = this.loginForm.value;

    const data = {
      username: this.user.username,
      password: this.user.password
      };
    this.http.post(this.endpoint, data).subscribe(Response => console.log(Response));
    }
  }

  getCat() {
    this.http.jsonp(this.catelog + 'catelog.json?output=json', 'callback')
    .subscribe(data => console.log(data));
  }

}
