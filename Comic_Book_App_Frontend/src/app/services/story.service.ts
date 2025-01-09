import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OCRJob, panelJob } from './job';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  apiURL = 'http://localhost:3000/aggregation-service/api/';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  panelSegmentation(formData): Observable<panelJob> {
    return this.http.post<panelJob>(this.apiURL + 'panel_segmentation/start', formData);
  }

  getSegmentedPanels(url): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  characterRecognition(formData): Observable<Blob> {
    return this.http.post(this.apiURL + 'CCR/start', formData, { responseType: 'blob' });
  }

  objectRecognition(formData): Observable<Blob> {
    return this.http.post(this.apiURL + 'COD/start', formData, { responseType: 'blob' });
  }

  extractText(formData): Observable<OCRJob> {
    return this.http.post<OCRJob>(this.apiURL + 'OCR/start', formData);
  }

  balloonSegmentation(formData): Observable<Blob> {
    return this.http.post(this.apiURL + 'balloon_segmentation/start', formData, { responseType: 'blob' });
  }

  getAudio(inputText): Observable<Blob> {
    return this.http.post(this.apiURL + 'TTS/start', inputText, { responseType: 'blob' });
  }
}
