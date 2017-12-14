import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./styles.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {
    document.getElementById('splash').style.display = 'none';
  }
}
