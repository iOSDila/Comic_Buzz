import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageService = new BehaviorSubject<Object>(false);
  currentStatus = this.messageService.asObservable();
  message: { status: boolean; username: string; };

  constructor() { }

  changeStatus(status: boolean, username: string) {

    this.message = {
      status: status,
      username: username
    }

    this.messageService.next(this.message);
  }

}
