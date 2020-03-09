import { Resource } from '../models/resource.model';
import {Serializer} from '../serializers/Serializer';
import { of as observableOf,  Observable, throwError, empty } from 'rxjs';
import { map, tap, catchError} from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { PaginatedCollection } from 'src/app/misc/utils';

export class ResourceApiService<T extends Resource> {
  
    API_URL: string; // = AppConfigService.settings.apiUrl;

    protected headers: HttpHeaders = new HttpHeaders();

    constructor(
        protected httpClient: HttpClient,
        protected endpoint: string,
        protected serializer: Serializer<T>) {
          
          this.API_URL = AppConfigService.settings.apiUrl;
          this.headers = this.headers.set('Content-Type', 'application/json');
        }

      create(item: T): Observable<any> {


        return this.httpClient
          .post<any>(
            `${this.API_URL}/${this.endpoint}`, 
            this.serializer.toJson(item), 
            {headers: this.headers}
          )
          .pipe(
            catchError(this.handleError)
          );
      }

      update(item: T): Observable<any> {
        return this.httpClient
          .put<any>(
            `${this.API_URL}/${this.endpoint}/${item.id}`,
            this.serializer.toJson(item),
            {headers: this.headers}
          ).pipe(
            catchError(this.handleError)
          );
        }

      read<TID extends number | string>(id: TID): Observable<T> {
        return this.httpClient
          .get<T>(`${this.API_URL}/${this.endpoint}/${id}`)
          .pipe(
            catchError(this.handleError),
            map((data: any) => this.serializer.fromJson(data.data))
          );
      }

      list(params: HttpParams): Observable<PaginatedCollection<T>> {
        return this.httpClient
          .get<T[]>(`${this.API_URL}/${this.endpoint}`,{
            headers: this.headers,
            params
          })
          .pipe(
            catchError(this.handleError),
            map((data: any) => {
              return {
                collection: this.convertCollection(data.data),
                pagination: data.meta
              };
            })
          )
      }

      delete<TID extends number | string>(id: TID) {
        return this.httpClient
          .delete(`${this.API_URL}/${this.endpoint}/${id}`);
      }

      protected convertCollection(collection: any[]): T[] {
        return collection.map(item => this.serializer.fromJson(item))
      }

      protected handleError(error: any) {
        const statusError = `${error.status}: ${error.statusText}`;
        console.log(`Request failed: \n${statusError}`);
        // Let the app keep running by returning an empty result.
      
        return empty();
        // return throwError(statusError);  // empty(); // observableOf(error);
      }
}
