import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Util } from "../../../helpers/util.helper";
import { User } from './../../../models/user.model';
import { Router } from '@angular/router';

export interface UserLoginInfo {
  unique:string,
  password?:string
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  user_info:UserLoginInfo = <UserLoginInfo>{ };
  title:string = 'Login';
  user:any;

  loginForm = new FormGroup({
    unique: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  getInputErrorMessage(input_name:string) {
    var err_message:string = '';
    if(this.loginForm.get(input_name).hasError('required')) {
      if(input_name=='unique') {
        err_message = 'You must enter an Email.';
      } else {
        err_message = 'You must enter a Password.';
      }
    }
    if(this.loginForm.get(input_name).hasError('custom')) {
      err_message = this.loginForm.get(input_name).getError('custom');
    }

    return err_message;
  }

  throwInputError(input_name:string, message:string){
    this.loginForm.get(input_name).setErrors({custom: message});
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateRegister(){
    this.router.navigate(['register'])
  }

  async onSubmit(){
    var data = {
      unique_key    :this.user_info.unique,
      password      :this.user_info.password,
    };
    this.login(data);
    return;
  }

  async login(data: Object) {
    var err;
    [err, this.user] = await Util.to(User.LoginReg(data));
    if(err) {
      if(err.message.includes('password') || err.message.includes('Password')) {
        this.throwInputError('password', err.message);
      }
      if(err.message.includes('email') || err.message.includes('Email')) {
        this.throwInputError('unique', err.message);
      }
      return;
    }

    return this.user.to('update');
  }
}
