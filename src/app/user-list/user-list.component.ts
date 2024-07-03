import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../../app/components/user-form/user-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit  {
  users:any[] = [];

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  pageSize = 5;
  currentPage = 0;
  paginatedUsers: User[] = [];

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.get_users()

    this.userService.session$.subscribe((res:any) => {
      this.get_users()
      
    })
    // this.updatePaginatedUsers();
  }

  get_users(){
    this.users = this.userService.getstorage("users")
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { user },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePaginatedUsers();
      }
    });
  }

  deleteUser(user: User): void {
    const find_user_index = this.users.findIndex(u => u.id === user.id);
    console.log(find_user_index);
    
    this.users.splice(find_user_index,1)

   
      this.userService.setstorage("users",this.users)


    
  this.userService.deleteUser(this.users)
    
  }

  sortData(sort: any): void {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.users = data;
      return;
    }

    this.users = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        default: return 0;
      }
    });
    this.updatePaginatedUsers();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  private updatePaginatedUsers(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}