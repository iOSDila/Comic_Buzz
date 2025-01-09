import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  resetPasswordForm: FormGroup;
  reset = false;
  submitted = false;
  loggedIn: boolean;
  username: string;
  isError: boolean = false;
  newPassword: { username: string; password: string; };

  @ViewChild('dialogSuccess') dialogSuccess: TemplateRef<any>;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  message: string;
  status: string;
  mode: string;

  constructor(private service: UserService, public router: Router, public dialog: MatDialog) { }

  ngOnInit() {

    this.username = localStorage.getItem('token');
    this.getProfileDetails(this.username);

    this.profileForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'phone_num': new FormControl('', [Validators.required]),
      'birth_date': new FormControl('', [Validators.required]),
      'role': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.email])
    });

    this.resetPasswordForm = new FormGroup({
      'currentPassword': new FormControl('', [Validators.required]),
      'newPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl('', [Validators.required])
    });

    //disable usertype
    this.profileForm.get('role').disable();

  }

  setData(profile) {
    this.profileForm.controls['name'].setValue(profile.name);
    this.profileForm.controls['username'].setValue(profile.username);
    this.profileForm.controls['phone_num'].setValue(profile.phone_num);
    this.profileForm.controls['role'].setValue(profile.role);
    this.profileForm.controls['email'].setValue(profile.email);
    this.profileForm.controls['birth_date'].setValue(profile.birth_date);
  }

  get f() { return this.profileForm.controls; }

  get r() { return this.resetPasswordForm.controls; }

  getProfileDetails(username: string) {
    this.service.getUser(username).subscribe((data) => {
      this.setData(data);
    })
  }

  updateProfile() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.service.updateUser(this.profileForm.value).subscribe((data) => {
      if (data['status'] == '200') {
        this.message = "Profile updated successfully";
        this.status = "Success"
      }
      else {
        this.message = "Profile updating failed";
        this.status = "Failed"
      }
      this.openDialog();
    })
  }

  resetPassword() {
    this.reset = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    else {
      if (this.resetPasswordForm.value.newPassword == this.resetPasswordForm.value.confirmPassword) {

        this.newPassword = {
          username: this.profileForm.value.username,
          password: this.resetPasswordForm.value.newPassword
        }

        this.service.resetPassword(this.newPassword).subscribe((data) => {
          if (data['status'] == '200') {
            this.message = "Password reset successful"
            this.status = "Success"
            this.mode = "resetpassword"
          }
          else {
            this.message = "Password reset failed"
            this.status = "Failed"
          }
          this.openDialog();
        })
      }
      else {
        this.isError = true;
      }
    }
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogSuccess, {
      panelClass: 'my-class'
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
    if (this.mode == "resetpassword") {
      this.router.navigate(['/login'])
    }
  }
}
