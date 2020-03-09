import { Resource } from './resource.model';

export class User extends Resource {
    constructor(public id: number,
                public firstName?:string,
                public lastName?: string,
                public email?: string,
                public password?: string,
                public avatarImg?: string) {
                    super(id);
    }
}
