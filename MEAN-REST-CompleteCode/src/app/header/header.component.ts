import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../Auth/auth-service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authStatusListener: Subscription
  userIsAuthenticated=false;

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.userIsAuthenticated=this.authService.getIsAuth()
    this.authStatusListener=this.authService.authStatusListener.subscribe(isAuthenticated=>{
          this.userIsAuthenticated=isAuthenticated;
    })
  }

  onLogout(){
      this.authService.logout()
  }

  ngOnDestroy(){
    this.authStatusListener.unsubscribe()
  }

}
