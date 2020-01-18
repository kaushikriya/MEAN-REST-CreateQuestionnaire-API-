import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import {Observable} from 'rxjs';
import { promise } from "protractor";
import { AuthService } from "./auth-service";

@Injectable()
export class authGuard implements CanActivate{
constructor(private authService: AuthService, private router: Router){}

private isAuth=false;

canActivate(
     route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean| Observable<boolean>| Promise<boolean>{
     this.isAuth=this.authService.getIsAuth()
     console.log(this.isAuth)
     if(!this.isAuth){
         this.router.navigate(['/login']);
     }
     return this.isAuth;
}
  
}