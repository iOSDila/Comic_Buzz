import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-template',
  templateUrl: './home-template.component.html',
  styleUrls: ['./home-template.component.css']
})
export class HomeTemplateComponent implements OnInit {
  mobile: boolean;

  constructor() { }

  ngOnInit() {
    if (window.screen.width <= 425) { // 768px portrait
      console.log(window.screen.width)
      this.mobile = true;
    }
    else {
      this.mobile = false;
    }
  }

}
