import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service'
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  resetPasswordForm: FormGroup;
  submitted = false;
  isError: boolean = false;
  returnUrl: string;
  userType: string;
  mobile: boolean;

  @ViewChild('loginSuccess') loginSuccess: TemplateRef<any>;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  message: string;
  status: string;

  constructor(private service: UserService, public router: Router, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit() {

    if (window.screen.width <= 425) { // 768px portrait
      console.log(window.screen.width)
      this.mobile = true;
    }
    else {
      this.mobile = false;
    }

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.resetPasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.returnUrl = '/home-template/home';
    this.authService.logout();

  }

  get f() { return this.loginForm.controls; }


  onSubmit() {

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.service.authenticateUser(this.loginForm.value).subscribe((data) => {
        if (data['authenticated']) {
          localStorage.setItem('isLoggedIn', "true");
          localStorage.setItem('token', this.loginForm.value.username);

          this.service.getUser(this.loginForm.value.username).subscribe((data) => {
            this.userType = data.role;
            localStorage.setItem('userRole', this.userType);

            this.message = "logged in successfully";
            this.status = "Success"
            this.openDialog();
          })
        }
        else {
          this.isError = true;
        }
      })
    }
  }

  createAccount() {
    this.router.navigate(['/register'])
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.loginSuccess, {
      panelClass: 'my-class'
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
    if (this.userType == "Admin User") {
      this.router.navigate(['/home-template/admin-user']);
    }
    else {
      this.router.navigate(['/home-template/home']);
    }
  }
}
