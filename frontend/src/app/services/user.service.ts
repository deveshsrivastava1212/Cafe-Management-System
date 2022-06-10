import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Injectable, Type } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }
  signup(data:any){
    return this.httpClient.post(this.url+
      "/user/signup",data,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      })
  }
  forgotPassword(data:any){
    return this.httpClient.post(this.url+
      "/user/forgotPassword/",data,{
        headers: new HttpHeaders().set('Content-type',"application/json")
      })
  }
}
