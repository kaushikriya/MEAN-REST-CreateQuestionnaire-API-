import {Injectable} from '@angular/core'
import {Router} from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { authData } from './authData';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService{
constructor(private http: HttpClient, private router: Router){}
private tokenTimer: NodeJS.Timer
private token:string;
private isAuthenticated=false;
private userId: string;
public authStatusListener=new Subject<boolean>()

   getToken(){
       if(typeof(this.token=='object')){
       return this.token;
       }
   }   

   getuserId(){
       return this.userId
   }

   getIsAuth(){
       return this.isAuthenticated
   }

   getauthStatus(){
       return this.authStatusListener.asObservable() 
   }


  createUser(email: string, password: string){
   const authData: authData={
       email: email,
       password: password
   }
   this.http.post('http://localhost:3000/api/user/signup', authData)
   .subscribe(response=>{
       console.log(response);
   })
}
   login(email:string, password:string){
    let responseToken;
    const authData: authData={
        email: email,
        password: password
    }
       let expirationdate;
       this.http.post<{token:string, message:string,  expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
       .subscribe(response=>{
        const tokenExpiresIn=response.expiresIn
        this.userId=response.userId
        this.setTimer(tokenExpiresIn);
        responseToken=response.token;
        const now= new Date
        expirationdate=new Date(now.getTime()+tokenExpiresIn*1000) 
        },
       err=>{
           console.log(err)
       },
       ()=>{
           if(responseToken){
            this.token=responseToken;
            this.isAuthenticated=true;
            this.authStatusListener.next(true)
            this.saveAuthData(this.token,expirationdate, this.userId)
            this.router.navigate(['/'])
           }
       }
       )
   }

   autoAuthUser(){
       const authInfo=this.getAuthData();
       if(!authInfo){
           return;
       }
       const now= new Date()
       const expiresIn=authInfo.expiration.getTime()-now.getTime()
       if (expiresIn>0){
        this.token=authInfo.token
        this.isAuthenticated=true
        this.userId=authInfo.userId
        this.setTimer(expiresIn/1000);
        this.authStatusListener.next(true)
       }
   }

   logout(){
       this.token=null;
       this.isAuthenticated=false;
       this.authStatusListener.next(false)
       this.userId=null
       this.router.navigate(['/'])
       clearTimeout(this.tokenTimer)
       this.clearAuthData()
   }

   setTimer(duration: number){
    this.tokenTimer=setTimeout(() => {
        this.logout()
        }, duration*1000);
   }

   private saveAuthData(token: string, expirationdate: Date, userId: string){
       localStorage.setItem("token", token);
       localStorage.setItem("expiration", expirationdate.toISOString())
       localStorage.setItem("userId", userId)
   }

   private clearAuthData(){
       localStorage.removeItem("token");
       localStorage.removeItem("expiration")
       localStorage.removeItem("userId")
   }

   private getAuthData(){
       this.token=localStorage.getItem("token")
       const expirationDate=localStorage.getItem("expiration")
       const userId=localStorage.getItem("userId")
       if(!this.token || !expirationDate){
           return 
       }
       return {
           token:this.token,
           expiration: new Date(expirationDate),
           userId: userId
       }
   }

}