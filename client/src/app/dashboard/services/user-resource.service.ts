import { Injectable } from '@angular/core';
import { ResourceApiService } from '../../core/services/resource-api.service';
import { HttpClient } from '@angular/common/http';
import { UserSerializer } from 'src/app/core/serializers/user.seriliazer';
import { User } from 'src/app/core/models/user.model';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable()
export class UserResourceService extends ResourceApiService<User> {

  constructor(httpClient: HttpClient) {
    super(
      httpClient,
      'users',
      new UserSerializer()
    );
  }

  listAll(): Observable<User[]> {
      return this.httpClient
        .get<User[]>(`${this.API_URL}/${this.endpoint}/all`, {
          headers: this.headers
        })
        .pipe(
          catchError(this.handleError),
          tap(result => console.log(result)),
          map((data: any) => this.convertCollection(data.data))
        );
  }
}

