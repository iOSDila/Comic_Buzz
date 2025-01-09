import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userType: string;

  @ViewChild('createStory') createStory: TemplateRef<any>;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  message: string;
  status: string;

  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit() { }

  navigateToCreateStory() {
    this.userType = localStorage.getItem('userRole');
    if (this.userType == "General User") {
      this.message = "If you want to save more stories upgrade to premium! Else your already created story will be replaced with this story. Do you want to proceed?";
      this.status = "Information"
      this.openDialog();
    }
    else {
      this.router.navigate(['/home-template/create-story']);
    }
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.createStory, {
      panelClass: 'my-dialog-class'
    });
  }

  proceed(): void {
    this.dialogRef.close();
    this.router.navigate(['/home-template/create-story']);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
