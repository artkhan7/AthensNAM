import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Util } from "../../../helpers/util.helper";
import { User } from './../../../models/user.model';
import { Router } from '@angular/router';

export interface UserRegisterInfo {
  unique:string,
  password?:string,
  confirm_password?:string,
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user_info:UserRegisterInfo = <UserRegisterInfo>{ };
  title:string = 'Register';
  user:any;
  state:string = 'register';

  registerForm = new FormGroup({
    unique: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  getInputErrorMessage(input_name:string) {
    var err_message:string = '';
    if(this.registerForm.get(input_name).hasError('required')) {
      if(input_name=='unique') {
        err_message = 'You must enter an Email.';
      } else {
        err_message = 'You must enter a Password.';
      }
    }
    if(this.registerForm.get(input_name).hasError('custom')) {
      err_message = this.registerForm.get(input_name).getError('custom');
    }

    return err_message;
  }

  throwInputError(input_name:string, message:string){
    this.registerForm.get(input_name).setErrors({custom: message});
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  async onSubmit(){
    var data = {
      unique_key    :this.user_info.unique,
      password      :this.user_info.password,
    };
    this.create(data);
    return;
  }

  navigateLogin(){
    this.router.navigate(['login'])
  }

  async create(data: Object){
    if(this.user_info.confirm_password!=this.user_info.password){
      this.throwInputError('confirmPassword', 'Passwords do not match');
      return
    }
    let err, user;
    [err, user] = await Util.to(User.CreateAccount(data))
    if(err) {
      if(err.message.includes('password') || err.message.includes('Password')) {
        this.throwInputError('password', err.message);
      }
      if(err.message.includes('email') || err.message.includes('Email')) {
        this.throwInputError('unique', err.message);
      }
      return;
    }
    this.state = 'wait';
    this.title = 'Check Inbox to activate this account';
  }
}
