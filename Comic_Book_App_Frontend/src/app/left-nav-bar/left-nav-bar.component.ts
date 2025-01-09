import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-nav-bar',
  templateUrl: './left-nav-bar.component.html',
  styleUrls: ['./left-nav-bar.component.css']
})
export class LeftNavBarComponent implements OnInit {

  loggedIn: boolean;
  status: string;

  constructor() { }

  ngOnInit() {
    this.status = localStorage.getItem('isLoggedIn');
    if (this.status == "true") {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }
  }

}
