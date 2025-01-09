import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Login } from './user';
import { Observable } from 'rxjs';
import { Payment, Job } from './pay';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiURL = 'http://localhost:3000/aggregation-service/api/';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  createUser(user): Observable<User> {
    return this.http.post<User>(this.apiURL + 'users/addUser', user, this.httpOptions);
  }

  updateUser(user): Observable<User> {
    return this.http.put<User>(this.apiURL + 'users/updateUser', user, this.httpOptions);
  }

  authenticateUser(login): Observable<Login> {
    return this.http.post<User>(this.apiURL + 'users/authenticate', login, this.httpOptions);
  }

  resetPassword(newPassword): Observable<Login> {
    return this.http.put<Login>(this.apiURL + 'users/updatePassword', newPassword, this.httpOptions);
  }

  getUser(username): Observable<User> {
    return this.http.get<User>(this.apiURL + 'users/usernames/' + username, this.httpOptions);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL + 'users', this.httpOptions);
  }

  deleteUser(username): Observable<User> {
    return this.http.delete<User>(this.apiURL + 'users/deleteUser/' + username, this.httpOptions);
  }

  pay(pay): Observable<Payment> {
    return this.http.post<Payment>(this.apiURL + 'payments/addPayment', pay, this.httpOptions);
  }

  getFilename(jobId): Observable<Job> {
    return this.http.get<Job>(this.apiURL + 'stories/jobs/' + jobId, this.httpOptions)
  }

  getStory(jobId, filename): Observable<Job> {
    return this.http.get<Job>(this.apiURL + 'stories/text/jobs/' + jobId + '/text_outputs/' + filename, this.httpOptions);
  }

  getAudio(jobId, filename): Observable<Blob> {
    return this.http.get(this.apiURL + 'stories/audio/jobs/' + jobId + '/audio_outputs/' + filename, { responseType: 'blob' });
  }

  getCharacterRecogniseImage(jobId, filename): Observable<Blob> {
    return this.http.get(this.apiURL + 'stories/image/jobs/' + jobId + '/CCR_image_output/' + filename, { responseType: 'blob' });
  }

  getObjectDetectImage(jobId, filename): Observable<Blob> {
    return this.http.get(this.apiURL + 'stories/image/jobs/' + jobId + '/COD_image_output/' + filename, { responseType: 'blob' });
  }

  getBalloonExtractImage(jobId, filename): Observable<Blob> {
    return this.http.get(this.apiURL + 'stories/image/jobs/' + jobId + '/balloon_output/' + filename, { responseType: 'blob' });
  }

  getOCROutput(jobId, filename): Observable<Job> {
    return this.http.get<Job>(this.apiURL + 'stories/text/jobs/' + jobId + '/ocr_output/' + filename, this.httpOptions);
  }

  getlastJob(username): Observable<Job> {
    return this.http.get<Job>(this.apiURL + 'stories/last_saved/users/' + username, this.httpOptions)
  }

  getAllJobsForUser(username): Observable<Job> {
    return this.http.get<Job>(this.apiURL + 'stories/jobs/users/' + username, this.httpOptions)
  }
}
