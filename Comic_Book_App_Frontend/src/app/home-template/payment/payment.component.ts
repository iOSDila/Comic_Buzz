import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';
import { Payment } from 'src/app/services/pay';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  payForm: FormGroup;
  submitted = false;
  username: string;
  payInfo: any

  constructor(private service: UserService, public router: Router) { }

  ngOnInit() {

    this.username = localStorage.getItem('token');

    this.payForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'card_num': new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
      'expiry': new FormControl('', [Validators.required]),
      'cvv': new FormControl('', [Validators.required, Validators.maxLength(3)]),
    });
    this.setData();
  }

  setData() {
    this.payForm.controls['name'].setValue('');
  }

  get f() { return this.payForm.controls; }

  pay() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.payForm.invalid) {
      return;
    }

    this.payInfo = {
      username: this.username,
      name: this.payForm.value.name,
      card_num: this.payForm.value.card_num,
      expiry: this.payForm.value.expiry,
      cvv: this.payForm.value.cvv
    }

    this.service.pay(this.payInfo).subscribe((data) => {
      this.router.navigate(['/home-template/home'])
    })
  }

}
