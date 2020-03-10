import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject, empty, of, BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { switchMap, map, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { UserResourceService } from '../../services/user-resource.service';
import { PaginatedCollection, PaginationInfo } from 'src/app/misc/utils';
import { range as _range } from 'lodash';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  readonly itemsPerPage: number = 10;
  users: User[];
  pagination$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  paginationInfo: PaginationInfo = null;
  loading: boolean = false;
  subscription: Subscription;

  constructor(protected userService: UserResourceService) { }

  ngOnInit(): void {
    this.subscription = this.pagination$.pipe(
      tap( _ => {
        this.loading = true;
      }),
      switchMap((page: number) => this.getUsers(page))
    )
    .subscribe((data: PaginatedCollection<User>) => {
      this.users = data.collection;
      this.paginationInfo = data.pagination;
      this.paginationInfo.pageNumbers = this.getShiftedPages(this.paginationInfo.lastPage); 
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getShiftedPages(totalPages: number): Array<number> {
    const page = this.currentPage;
    let startPage: number;
    let endPage: number;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (page <= 3) {
          startPage = 1;
          endPage = 5;
      } else if (page + 1 >= totalPages) {
          startPage = totalPages - 4;
          endPage = totalPages;
      } else {
          startPage = page - 2;
          endPage = page + 2;
      }
    }

    let pages = _range(startPage, endPage + 1);
    return pages;
  }

  
  getUsers(page: number): Observable<PaginatedCollection<User>> {

    const params: HttpParams = new HttpParams()
      .set('page', `${page}`)
      .set('count', `${this.itemsPerPage}`);
    //  .set('orderfield', 'id')
    //  .set('orderdirection', 'ASC');

    //return this.userService.list(params) || empty();

    return this.userService.list(params);
  }
  
  reload() {
    this.pagination$.next(this.currentPage);
  }

  get currentPage(): number {
    return this.pagination$.value;
  }

  paginate(page: number): void {
    this.pagination$.next(page);
  }

  paginatePrev() {
    const page = this.currentPage;
    if (page - 1 > 0) {
      this.paginate(page - 1);
    }
    
  }

  paginateNext() {
    const page = this.currentPage;
    if (page + 1 <= this.paginationInfo.lastPage) {
      this.paginate(page + 1);
    }
  }
}
