// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: any[] = [];
  private subject = new Subject<any>();
  public session$ = this.subject.asObservable();
 
  constructor() {
 
  }



  addUser(user: User) {
    user.id = Math.floor(Math.random() * 90 + 10);
    this.users = this.getstorage("users")
    this.users.push(user);
    this.setstorage("users",this.users)
    this.subject.next(this.users)
  }

  updateUser(updatedUser: User) {
    const index = this.users.findIndex(user => user.id === updatedUser.id);

      this.users[index] = updatedUser;
      console.log(this.users);
      
      this.setstorage("users",this.users)
      setTimeout(() => {
        this.subject.next(this.users)
      }, 200);
     
    
  }

  deleteUser(list: any) {
    this.subject.next(list)
  }

  removestorage(x: any) {
    localStorage.removeItem(x);
  }

  setstorage(x: any, y: any) {
    localStorage.setItem(x, JSON.stringify(y));
  }

  getstorage(x: any) {
    return JSON.parse(localStorage.getItem(x) || '[]');
  }

}
