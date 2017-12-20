import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { User } from './user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  user: User;
  cats: any;
  endpoint = 'https://us-central1-nickels-catalog.cloudfunctions.net/auth';

  constructor(private http: HttpClient, private db: AngularFirestore) {  }

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

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
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

  setImages(a) {
    const attached = a.map(el => {
      const item = {
        title: el.title,
        video: el.video,
        tags: el.tags
      };
      return item;
    });
    return attached;
  }

  setPar(a) {
    const attached = a.map(el => {
      const item = {
        class: el.class,
        text: el.text
      };
      return item;
    });
    return attached;
  }

  getCat() {
    this.http.get('../../assets/json/specifications.json')
    .subscribe(data => {
      this.cats = data['specifications'];
      console.log(this.cats.length, this.cats);
      let n = 0;
      this.cats.forEach(cat => {
        const crudInfo = {
            createdAt: this.timestamp,
            updatedAt: this.timestamp,
            updateBy: 'Robert Leeuwerink',
            createdBy: 'Robert Leeuwerink'
        };
        const obj = {
          title: cat.title,
          code: cat.id,
          content: cat.content
        };
        console.log({ crudInfo, ...obj });
        // this.db.collection('specifications').add({ crudInfo, ...obj });
        console.log(n + ' of ' + this.cats.length, cat.code);
        n++;
      });
    });
  }
}
