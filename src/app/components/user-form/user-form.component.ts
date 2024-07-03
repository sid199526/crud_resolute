import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    if (data && data.user) {
      this.userForm.patchValue(data.user);
    }
  }

  ngOnInit(): void {}

  save() {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      if (user.id) {
        console.log("updateeeeeeeeeeeeeeeeeee",user);
        
        this.userService.updateUser(user);
      } else {
        this.userService.addUser(user);
      }
      this.dialogRef.close(true);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  

}
