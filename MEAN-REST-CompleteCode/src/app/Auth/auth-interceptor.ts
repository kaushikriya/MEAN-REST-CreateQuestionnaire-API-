import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth-service";
import { tokenize } from "@angular/compiler/src/ml_parser/lexer";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

constructor(private AuthService: AuthService){}


intercept(req:HttpRequest<any>, next: HttpHandler){
    const authToken= this.AuthService.getToken();
    if(typeof(authToken==='object')){
        const authRequest=req.clone({
            headers: req.headers.set('Authorization',"Bearer "+ authToken)
        })
        return next.handle(authRequest);
    }
    else{
        console.log('Token not fetched')
    }
    }
}
