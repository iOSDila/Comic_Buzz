import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service'
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DateValidator } from '../shared/date.validator';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  profileForm: FormGroup;
  submitted = false;

  @ViewChild('registerSuccess') registerSuccess: TemplateRef<any>;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  message: any;
  userType: string;
  status: string;
  mobile: boolean;

  constructor(private service: UserService, public router: Router, public dialog: MatDialog) { }
  ngOnInit() {

    if (window.screen.width <= 425) { // 768px portrait
      console.log(window.screen.width)
      this.mobile = true;
    }
    else {
      this.mobile = false;
    }

    this.profileForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'phone_num': new FormControl('', [Validators.required, Validators.minLength(10)]),
      'birth_date': new FormControl('', [Validators.required, DateValidator.dateValidator]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.setData();
  }

  setData() {
    this.profileForm.controls['name'].setValue('');
  }

  get f() { return this.profileForm.controls; }

  createUser() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.service.createUser(this.profileForm.value).subscribe((data) => {
      if (data["level"] == "error") {
        this.message = "User creation failed";
        this.status = "Failed"
      }
      else {
        this.message = "User creation successful";
        this.status = "Success"
      }
      this.openDialog();
    })
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.registerSuccess, {
      panelClass: 'my-class'
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
    if (this.message == "user creation unsuccessful") {
      this.router.navigate(['/register'])
    }
    else {
      localStorage.setItem('isLoggedIn', "true");
      localStorage.setItem('token', this.profileForm.value.username);
      this.service.getUser(this.profileForm.value.username).subscribe((data) => {
        this.userType = data.role;
        localStorage.setItem('userRole',  this.userType);

        if (this.userType == "Admin User") {
          this.router.navigate(['/home-template/admin-user']);
        }
        else {
          this.router.navigate(['/home-template/home']);
        }
      })
    }
  }

}
