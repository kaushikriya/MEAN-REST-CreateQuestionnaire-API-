import { Component } from "@angular/core";
import {NgForm} from "@angular/forms"
import {authData} from '../authData'
import {AuthService} from '../auth-service'

@Component({
    templateUrl: './signUp.component.html',
    styleUrls: ['./signUp.component.css']

})

export class signUpComponent{
    isloading=false;

    constructor(public Authservice: AuthService){}

    onSignUp(form: NgForm){
      const authData: authData={
             email:form.value.email,
             password: form.value.password
      }
      this.isloading=true;
      this.Authservice.createUser(authData.email, authData.password)

    }
}