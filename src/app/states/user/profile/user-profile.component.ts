import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as actions from '../user.actions';
import * as fromUser from '../user.reducer';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {

  user: Observable<any>;

  constructor(private store: Store<fromUser.State>) { }

  ngOnInit() {
    this.user = this.store.select(fromUser.selectAll);
  }

}
