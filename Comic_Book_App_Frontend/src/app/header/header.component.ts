import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { UserService } from '../services/user.service';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean = false;
  status: string;
  userType: String;

  @ViewChild('upgrade') upgrade: TemplateRef<any>;
  upgradeDialogRef: MatDialogRef<TemplateRef<any>>;

  constructor(private router: Router, private authService: AuthService, private location: Location, public userService: UserService, public dialog: MatDialog) { }

  ngOnInit() {
    this.status = localStorage.getItem('isLoggedIn');
    this.userType = localStorage.getItem('userRole');

    if (this.status == "true") {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  back() {
    if (this.router.url != "/home-template/home") {
      this.location.back();
    }
  }

  home() {
    if (this.userType == "Admin User") {
      this.router.navigate(['/home-template/admin-user']);
    }
    else {
      this.router.navigate(['/home-template/home']);
    }
  }

  openUpgradeModel() {
    this.userType = localStorage.getItem('userRole');
    if (this.userType == "General User") {
      document.getElementById("openModalButton").click();
    }
    else {
      this.openDialog();
    }
  }

  pay() {
    this.router.navigate(['/home-template/pay']);
  }

  openDialog(): void {
    this.upgradeDialogRef = this.dialog.open(this.upgrade, {
      panelClass: 'my-class'
    });
  }

  closeDialog(): void {
    this.upgradeDialogRef.close();
  }
}
