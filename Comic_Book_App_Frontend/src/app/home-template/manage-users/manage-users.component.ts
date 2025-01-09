import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  profileForm: FormGroup;
  resetPasswordForm: FormGroup;
  submitted = false;
  reset = false;
  searchText: String;
  isError: boolean = false;
  newPassword: { username: string; password: string; };
  Users: any[] = [];

  @ViewChild('dialogSuccess') dialogSuccess: TemplateRef<any>;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  message: string;
  status: string;
  mode: string;

  constructor(private service: UserService, public dialog: MatDialog, public router: Router) { }

  ngOnInit() {

    this.getProfileDetails();

    this.profileForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'phone_num': new FormControl('', [Validators.required]),
      'role': new FormControl('', [Validators.required])
    });
    this.resetPasswordForm = new FormGroup({
      'currentPassword': new FormControl('', [Validators.required]),
      'newPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl('', [Validators.required])
    });
  }

  setData(user) {
    this.profileForm.controls['name'].setValue(user.name);
    this.profileForm.controls['username'].setValue(user.username);
    this.profileForm.controls['phone_num'].setValue(user.phone_num);
    this.profileForm.controls['role'].setValue(user.role);
    this.profileForm.controls['email'].setValue(user.email);

  }

  get f() { return this.profileForm.controls; }

  get r() { return this.resetPasswordForm.controls; }


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

  deleteUser(user) {
    this.service.deleteUser(user.username).subscribe((data) => {
      this.getProfileDetails();
    })
  }

  editUser(user) {
    this.setData(user);
  }

  getProfileDetails() {
    this.Users = [];
    this.service.getAllUsers().subscribe((data) => {
      data.forEach(element => {
        this.Users.push(element)
      });
    })
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
    this.getProfileDetails();
  }
}
