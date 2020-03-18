import { ValidatorFn } from '@angular/forms';
import { User } from '../core/models/user.model';
import { Resource } from '../core/models/resource.model';

export type FormEnvironment = 'creator' | 'editor';

export enum FormStatus {
    IDLE = 'idle',
    ERROR = 'error',
    SUCCESS = 'success'
}
  
export interface FormStateInfo {
    type?: FormStatus;
    elementTitle? : string;
    message?: string;
}

export enum SessionState {
    valid = 'valid',
    loggedOut = 'loggedOut',
    locked = 'locked',
    invalid = 'invalid',
}
  
export interface SessionUserData {
    user?: User;
    state?: SessionState;
}

// General error class
export interface AppError<ErrType extends Object | string> {
    type: ErrType;
    message?: string;
}

export interface SubmitResult {
    data?: any,
    message?: string;
    callback?: VoidFunction;
}

export interface PaginationInfo {
    total: number;
    numItems: number;
    from: number;
    to: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    pageNumbers?: number[]; // to display nearby page numbers
  }
  
export interface PaginatedCollection<T extends Resource> {
    collection: T[];
    pagination: PaginationInfo; 
}

export abstract class BaseFormData {

    constructor() {
        this.setDefaults();
    }

    abstract setDefaults(): void;
    abstract toString(): string;
}

export class LoginData extends BaseFormData {

    email: string;
    password: string;

    constructor() {
        super();
    }

    setDefaults(): void {
        this.email = '';
        this.password = '';
    }

    public toString(): string {
        return `email:${this.email};password:${this.password}`;
    }
  }

export class RegData extends BaseFormData {

    firstName: string;
    lastName: string;
    email: string;
    password: string;

    constructor() {
        super();
    }

    setDefaults(): void {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
    }

    public toString(): string {
        return `firstName:${this.firstName};lastName:${this.lastName};email:${this.email};password:${this.password}`;
    }
}