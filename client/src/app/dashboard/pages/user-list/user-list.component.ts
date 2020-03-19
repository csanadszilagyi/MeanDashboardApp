import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject, empty, of, BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { switchMap, map, tap, debounceTime, distinctUntilChanged, filter, throttleTime } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { UserResourceService } from '../../services/user-resource.service';
import { PaginatedCollection, PaginationInfo, AppError } from 'src/app/misc/utils';
import { range as _range } from 'lodash';

interface LoadInfo {
  page: number;
  search: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  readonly itemsPerPage: number = 10;
  users: User[];

  dataLoader$: BehaviorSubject<LoadInfo> = new BehaviorSubject<LoadInfo>({page: 1, search: ''});

  paginationInfo: PaginationInfo = null;
  loading: boolean = false;

  loaderSubscription: Subscription;
  searchSubscription: Subscription;

  searchTerm$: Subject<string> = new Subject<string>();

  error: string = '';

  constructor(protected userService: UserResourceService) { }

  ngOnInit(): void {

    this.loaderSubscription = this.dataLoader$.pipe(
        tap( _ => {
          this.loading = true;
        }),
        switchMap((info: LoadInfo) => this.getUsers(info))
    )
    .subscribe(
      (data: PaginatedCollection<User>) => this.handleResult(data)
    );

    // handling search
    this.searchSubscription = this.searchTerm$.pipe(
        filter((search: string) => search.length === 0 || search.length > 1),
        debounceTime(500),
        distinctUntilChanged(),
        // switchMap((search: string) => of(search))
    )
    .subscribe(
        (search: string) => {     
          this.changeData({page: 1, search});
        }
    )
  }

  handleResult(data: PaginatedCollection<User>): void {
    
    if (!data.collection.length) {
      this.error = 'No result';
    } 
    else {
      this.error = '';
    }
    
    this.users = data.collection;
    this.paginationInfo = data.pagination;
    this.paginationInfo.pageNumbers = this.getShiftedPages(this.paginationInfo.lastPage); 
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.loaderSubscription.unsubscribe();
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
  
  getUsers(info: LoadInfo): Observable<PaginatedCollection<User>> {
    // adding count
    let params = new HttpParams()
      .set('count', `${this.itemsPerPage}`);

    Object.keys(info).forEach(key => {
        // we dont want to give empty strings
        const value = info[key].toString() || '';
        if (value !== '') {
          params = params.set(key, value);
        }
    });
    return this.userService.list(params);
  }
  
  reload() {
    this.dataLoader$.next(this.currentInfo);
  }

  get currentInfo(): LoadInfo {
    return this.dataLoader$.value;
  }

  get currentPage(): number {
    return this.dataLoader$.value.page;
  }

  get currentSearch(): string {
    return this.dataLoader$.value.search || '';
  }

  protected changeData(info: LoadInfo): void {
    const newInfo = {...this.currentInfo, ...info};
    this.dataLoader$.next(newInfo);
  }

  paginate(page: number): void {
    this.changeData({page, search: this.currentSearch});
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

    const str = $event.target.value.toString().trim();
    this.searchTerm$.next(str);
/*
    if (str !== '') {
      return;
    }

    this.changeData({page: 1, search: ''});
    */
    
  }
}
