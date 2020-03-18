import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject, empty, of, BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { switchMap, map, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { UserResourceService } from '../../services/user-resource.service';
import { PaginatedCollection, PaginationInfo, AppError } from 'src/app/misc/utils';
import { range as _range } from 'lodash';

interface LoadInfo {
  page: number;
  params: HttpParams;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  readonly itemsPerPage: number = 4;
  users: User[];

  dataLoader$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  paginationInfo: PaginationInfo = null;
  loading: boolean = false;

  paginationSubscription: Subscription;
  searchSubscription: Subscription;

  searchTerm$: Subject<string> = new Subject<string>();

  error: string = '';

  params: HttpParams = new HttpParams();

  constructor(protected userService: UserResourceService) { }

  ngOnInit(): void {

    this.paginationSubscription = this.dataLoader$.pipe(
      tap( _ => {
        this.loading = true;
      }),
      switchMap((page: number) => this.getUsers(page))
    )
    .subscribe((data: PaginatedCollection<User>) => this.handleResult(data));

    // handling search
    this.searchSubscription = this.searchTerm$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap( _ => {
        this.loading = true;
      }),
      switchMap((searchTerm: string) => this.getSearchResult(searchTerm))
    )
    .subscribe(
      (data: PaginatedCollection<User>) => this.handleResult(data)
    )
  }

  handleResult(data: PaginatedCollection<User>): void {
    if (!data.collection.length) {
      console.log(data.collection);
      this.error = 'No result';
    } else {
      this.error = '';
    }
    

    this.users = data.collection;
    this.paginationInfo = data.pagination;
    this.paginationInfo.pageNumbers = this.getShiftedPages(this.paginationInfo.lastPage); 
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.paginationSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
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

  getSearchResult(searchTerm: string): Observable<PaginatedCollection<User>> {
    this.params = this.params
      .set('search', `${searchTerm}`)
      .set('page', '1')
      .set('count', `${this.itemsPerPage}`);

    return this.userService.list(this.params);
  }
  
  getUsers(page: number): Observable<PaginatedCollection<User>> {

    this.params = this.params
      .set('page', `${page}`)
      .set('count', `${this.itemsPerPage}`);

    return this.userService.list(this.params);
  }
  
  reload() {
    this.dataLoader$.next(this.currentPage);
  }

  get currentPage(): number {
    return this.dataLoader$.value;
  }

  paginate(page: number): void {
    this.dataLoader$.next(page);
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

  handleInputEventOfSearch($event) {

    const val = $event.target.value.toString();

    if (val !== '') {
      this.searchTerm$.next(val);
      return;
    }

    this.params = this.params.delete('search');

    this.paginate(1);
   
  }
}
