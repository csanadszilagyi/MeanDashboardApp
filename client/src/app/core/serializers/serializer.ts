import { Resource } from '../models/resource.model';
import { HttpParams } from '@angular/common/http';

export interface Serializer<T extends Resource> {
    fromJson(json: any): T;
    toJson(resource: T): any;
    // toParams(resource: T): HttpParams;
}
