import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { StoryService } from 'src/app/services/story.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.component.html',
  styleUrls: ['./create-story.component.css']
})
export class CreateStoryComponent implements OnInit {

  url: string | ArrayBuffer = '../../assets/images/image1.png';
  uploadedFiles: Array<File>;
  imageUrl: string | ArrayBuffer = '../../assets/images/image1.png';
  uploadedImageFiles: Array<File>;
  username: string;
  userType: String;
  isAdmin: boolean = false;
  storyName: string;
  resultImage: any;
  panelResults = [];
  resultText: any;
  isText: boolean = true;
  isSelected: boolean = false;
  isTTSSelected: boolean = true;
  inputText: string;

  @ViewChild('uploadSuccess') uploadSuccess: TemplateRef<any>;
  uploadDialogRef: MatDialogRef<TemplateRef<any>>;
  message: string;
  status: string;

  subscription: Subscription;
  isPanel: boolean;
  audioToPlay: any;
  playing: boolean;
  isImage: boolean;
  input: { text: string; };
  isProgress: boolean = true;
  inProgress: string;

  constructor(private httpClient: HttpClient, private userservice: UserService, public dialog: MatDialog, public router: Router, public storyService: StoryService) { }

  ngOnInit() {
    this.userType = localStorage.getItem('userRole');
    if (this.userType == "Admin User") {
      this.isAdmin = true;
    }
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let imagePath = event.target.files;
      let imageName = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = reader.result; //add source to image
      };

      this.uploadedFiles = event.target.files;//TODO
    }
  }

  onImageFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      this.isSelected = true;

      var reader = new FileReader();
      let imagePath = event.target.files;
      let imageName = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imageUrl = reader.result; //add source to image
      };
      this.isProgress = true;
      this.inProgress = " "
      this.uploadedImageFiles = event.target.files;//TODO
    }
  }

  upload() {
    if (this.uploadedFiles && this.storyName) {
      this.username = localStorage.getItem('token');
      let formData = new FormData();
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append('image', this.uploadedFiles[i], this.uploadedFiles[i].name);
      }
      formData.append('story_name', this.storyName);
      formData.append('panel_extraction', 'false');
      formData.append('username', this.username);

      this.httpClient.post('http://localhost:3000/aggregation-service/api/stories/create', formData)
        .subscribe((response) => {
          console.log('response received is ', response);
          if (response['status'] == "in_progress") {
            this.message = "Image Uploaded Successfully";
            this.status = "Success"
          }
          else {
            this.message = "System is already processing a job for this user";
            this.status = "Information"
          }
          this.openDialog();
        });
    }
    else {
      if (!this.uploadedFiles) {
        this.message = "Choose a file to be uploaded";
        this.status = "Information"
      }
      else {
        this.message = "Enter a story name";
        this.status = "Information"
      }
      this.openDialog();
    }
  }

  uploadPage() {

    if (this.uploadedFiles && this.storyName) {
      this.username = localStorage.getItem('token');
      let formData = new FormData();
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append('image', this.uploadedFiles[i], this.uploadedFiles[i].name);
      }
      formData.append('story_name', this.storyName);
      formData.append('panel_extraction', 'true');
      formData.append('username', this.username);

      this.httpClient.post('http://localhost:3000/aggregation-service/api/stories/create', formData)
        .subscribe((response) => {
          console.log('response received is ', response);
          if (response['status'] == "in_progress") {
            this.message = "Image Uploaded Successfully";
            this.status = "Success"
          }
          else {
            this.message = "System is already processing a job for this user";
            this.status = "Information"
          }
          this.openDialog();
        });
    }
    else {
      if (!this.uploadedFiles) {
        this.message = "Choose a file to be uploaded";
        this.status = "Information"
      }
      else {
        this.message = "Enter a story name";
        this.status = "Information"
      }
      this.openDialog();
    }
  }

  extractPanel() {
    this.isSelected = false;
    this.isProgress = true;
    this.inProgress = "Panel Segmentation is in-progress";

    let formData = new FormData();
    for (var i = 0; i < this.uploadedImageFiles.length; i++) {
      formData.append('image', this.uploadedImageFiles[i], this.uploadedImageFiles[i].name);
    }

    this.storyService.panelSegmentation(formData).subscribe((res) => {
      res['callback_image_urls'].forEach(element => {
        this.storyService.getSegmentedPanels(element).subscribe((data) => {
          let reader = new FileReader();
          reader.addEventListener("load", () => {

            this.isProgress = false;
            this.isSelected = true;
            this.isText = false;
            this.isImage = false;
            this.isPanel = true;

            this.panelResults.push(reader.result);
          }, false);

          if (data) {
            reader.readAsDataURL(data);
          }
        })
      });
    })
  }

  recogniseCharacters() {
    this.isSelected = false;
    this.isProgress = true;
    this.inProgress = "Character Recognition is in-progress";

    let formData = new FormData();
    for (var i = 0; i < this.uploadedImageFiles.length; i++) {
      formData.append('image', this.uploadedImageFiles[i], this.uploadedImageFiles[i].name);
    }

    this.storyService.characterRecognition(formData).subscribe((data) => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {

        this.isProgress = false;
        this.isSelected = true;
        this.isText = false;
        this.isPanel = false;
        this.isImage = true;
        this.resultImage = reader.result;

      }, false);

      if (data) {
        reader.readAsDataURL(data);
      }
    })
  }

  detectObjects() {
    this.isSelected = false;
    this.isProgress = true;
    this.inProgress = "Object Detection is in-progress";

    let formData = new FormData();
    for (var i = 0; i < this.uploadedImageFiles.length; i++) {
      formData.append('image', this.uploadedImageFiles[i], this.uploadedImageFiles[i].name);
    }

    this.storyService.objectRecognition(formData).subscribe((data) => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {

        this.isProgress = false;
        this.isSelected = true;
        this.isText = false;
        this.isPanel = false;
        this.isImage = true;

        this.resultImage = reader.result;
      }, false);

      if (data) {
        reader.readAsDataURL(data);
      }
    })
  }

  recogniseText() {
    this.isSelected = false;
    this.isProgress = true;
    this.inProgress = "Speech Text Recognition is in-progress";

    let formData = new FormData();
    for (var i = 0; i < this.uploadedImageFiles.length; i++) {
      formData.append('image', this.uploadedImageFiles[i], this.uploadedImageFiles[i].name);
    }

    this.storyService.extractText(formData).subscribe((data) => {

      this.isProgress = false;
      this.isSelected = true;
      this.isText = true;
      this.isImage = false;
      this.isPanel = false;
      this.resultText = data['text']
    })
  }

  segmentBalloons() {
    this.isSelected = false;
    this.isProgress = true;
    this.inProgress = "Balloon Segmentation is in-progress";

    let formData = new FormData();
    for (var i = 0; i < this.uploadedImageFiles.length; i++) {
      formData.append('image', this.uploadedImageFiles[i], this.uploadedImageFiles[i].name);
    }

    this.storyService.balloonSegmentation(formData).subscribe((data) => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {

        this.isProgress = false;
        this.isSelected = true;
        this.isText = false;
        this.isPanel = false;
        this.isImage = true;

        this.resultImage = reader.result;
      }, false);

      if (data) {
        reader.readAsDataURL(data);
      }
    })
  }

  buildStory() {
    this.isSelected = false;
    this.isProgress = true;
    this.inProgress = "Story Buiding is in-progress";

    this.username = localStorage.getItem('token');
    let formData = new FormData();
    for (var i = 0; i < this.uploadedImageFiles.length; i++) {
      formData.append('image', this.uploadedImageFiles[i], this.uploadedImageFiles[i].name);
    }
    formData.append('panel_extraction', 'false');
    formData.append('username', this.username);
    formData.append('story_name', "test");

    this.httpClient.post('http://localhost:3000/aggregation-service/api/stories/create', formData)
      .subscribe((response) => {
        this.subscription = timer(0, 10000).pipe(
          switchMap(() => this.checkStatus(response['job_id']))
        ).subscribe(result => {
          if (result['status'] == "done") {
            this.subscription.unsubscribe();

            this.userservice.getFilename(response['job_id']).subscribe((response) => {
              let textPath = response.output['text_path'];
              let jobId = response.job_id;
              this.userservice.getStory(jobId, textPath).subscribe((data) => {

                this.isProgress = false;
                this.isSelected = true;
                this.isText = true;
                this.isImage = false;
                this.isPanel = false;
                this.resultText = data['text']
              })
            })
          }
        });
      });
  }

  textToSpeech() {
    this.isSelected = false;
    this.isTTSSelected = true;
    this.isProgress = true;
    this.inProgress = "Text to speech conversion is in-progress";

    this.input = {
      text: this.inputText
    }

    console.log(this.input)

    this.storyService.getAudio(this.input).subscribe((data) => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {

        this.isProgress = false;
        this.isTTSSelected = false;
        this.isText = false;
        this.isPanel = false;
        this.isImage = false;

        this.audioToPlay = reader.result;
      }, false);

      if (data) {
        reader.readAsDataURL(data);
      }
    })
  }

  play() {
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
    this.uploadDialogRef = this.dialog.open(this.uploadSuccess, {
      panelClass: 'my-class'
    });
  }

  closeDialog(): void {
    this.uploadDialogRef.close();
    if (this.message == "Image Uploaded Successfully") {
      this.router.navigate(['/home-template/created-story'])
    }
  }

  checkStatus(jobId) {
    return this.httpClient.get('http://localhost:3000/aggregation-service/api/stories/jobs/' + jobId + '/status')
  }

  changedInput() {
    this.isTTSSelected = false;
  }

}
