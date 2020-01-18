import { Component } from "@angular/core";
import {NgForm} from "@angular/forms"
import {AuthService} from "../auth-service"

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']

})

export class loginComponent{
    isloading=false;
    constructor( public AuthService: AuthService){}

    onLogin(form: NgForm){
      if(form.invalid){
          return;
      }
      this.isloading=true
      this.AuthService.login(form.value.email,form.value.password)
    }
}