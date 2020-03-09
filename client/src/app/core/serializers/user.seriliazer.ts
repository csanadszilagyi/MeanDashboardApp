import { Serializer } from './serializer';
import { User } from '../models/user.model';
import { HttpParams } from '@angular/common/http';

export class UserSerializer implements Serializer<User> {
    fromJson(json: any): User {
        return new User(json.id,
                        json.firstName,
                        json.lastName,
                        json.email);
    }

    toJson(user: User): any {
        return {
              data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
              }
        };
    }
}