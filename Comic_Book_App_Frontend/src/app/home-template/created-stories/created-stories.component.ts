import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-created-stories',
  templateUrl: './created-stories.component.html',
  styleUrls: ['./created-stories.component.css']
})
export class CreatedStoriesComponent implements OnInit {

  searchText: String;
  assetsImages = [];
  username: string;

  storyCreation: boolean = false;
  playing: boolean = false;
  text_story: string = "text story";
  ocr_extract_text: any;

  imageToShow: any;
  audioToPlay: any;
  ccrImageToShow: any;
  codImageToShow: any;
  userType: String;
  isAdmin: boolean = false;
  isPage: boolean;

  @ViewChild('storyStatus') storyStatus: TemplateRef<any>;
  storyStatusDialogRef: MatDialogRef<TemplateRef<any>>;
  message: string;
  status: string;

  constructor(private userservice: UserService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {

    this.username = localStorage.getItem('token');
    this.userType = localStorage.getItem('userRole');

    if (this.userType == "Premium User" || this.userType == "Admin User") {
      this.userservice.getAllJobsForUser(this.username).subscribe((response) => {
        for (let i = 0; i < Object.keys(response).length; i++) {
          const element = response[i];
          this.assetsImages.push({
            url: '../../assets/images/tintin.jpg',
            name: element.storyName,
            job_id: element.job_id
          })
        }
      });
      if (this.userType == "Admin User") {
        this.isAdmin = true;
      }
    }
    else if (this.userType == "General User") {
      this.userservice.getlastJob(this.username).subscribe((response) => {
        if (response) {
          this.assetsImages.push({
            url: '../../assets/images/tintin.jpg',
            name: response.storyName,
            job_id: response.job_id
          })
        }
        else {
          console.log("No story to display")
        }
      })
    }
  }

  story(job_Id) {
    this.userservice.getFilename(job_Id).subscribe((response) => {
      if (response.status == "done") {

        this.storyCreation = true;

        let textPath = response.output['text_path'];
        let audioPath = response.output['audio_path'];
        let ccr_image_path = response.output['ccr_image_path'];
        let cod_image_path = response.output['cod_image_path'];
        let balloon_image_path = response.output['balloon_image_path'];
        let ocr_file_path = response.output['ocr_file_path'];
        let jobId = response.job_id;

        this.userservice.getStory(jobId, textPath).subscribe((data) => {
          this.text_story = data['text']
        })

        this.userservice.getAudio(jobId, audioPath).subscribe((data) => {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            this.audioToPlay = reader.result;
          }, false);

          if (data) {
            reader.readAsDataURL(data);
          }
        })

        if (ccr_image_path) {
          this.isPage = false;
          this.userservice.getCharacterRecogniseImage(jobId, ccr_image_path).subscribe((data) => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
              this.ccrImageToShow = reader.result;
            }, false);

            if (data) {
              reader.readAsDataURL(data);
            }
          })
        }
        else {
          this.isPage = true;
        }

        if (cod_image_path) {
          this.userservice.getObjectDetectImage(jobId, cod_image_path).subscribe((data) => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
              this.codImageToShow = reader.result;
            }, false);

            if (data) {
              reader.readAsDataURL(data);
            }
          })
        }

        if (balloon_image_path) {
          this.userservice.getBalloonExtractImage(jobId, balloon_image_path).subscribe((data) => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
              this.imageToShow = reader.result;
            }, false);

            if (data) {
              reader.readAsDataURL(data);
            }
          })
        }
        if (ocr_file_path) {
          this.userservice.getOCROutput(jobId, ocr_file_path).subscribe((data) => {
            this.ocr_extract_text = data['text']
          })
        }
      }
      else if(response.status == "failed") {
        console.log("Story creation failed")
        this.message = "Story creation failed";
        this.status = "Failed"
        this.openDialog();
      }
      else{
        console.log("Story is creating")
        this.message = "Story is creating";
        this.status = "Information"
        this.openDialog();
      }
    })
  }

  playAudio() {
    let audio = new Audio();
    audio.src = this.audioToPlay;
    audio.load();
    if (this.playing == true) {
      audio.pause();
      this.playing = false;
    }
    else {
      this.playing = true;
      audio.play();
    }
  }

  openDialog(): void {
    this.storyStatusDialogRef = this.dialog.open(this.storyStatus, {
      panelClass: 'my-class'
    });
  }

  closeDialog(): void {
    this.storyStatusDialogRef.close();
  }
}
