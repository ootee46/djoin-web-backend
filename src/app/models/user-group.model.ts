import { UserModel } from './user.model';

export class UserGroupModel {
    id: number;
    name: string;
    isDeleted: boolean;
    active: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    users: UserModel[];
    constructor(data) {
        Object.assign(this, data);
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? data.active : true);
        this.users = (data.users && Array.isArray(data.users) ? data.users.map(c => new UserModel(c)): []);
    }
}

export class UserGroupFormModel {
    id: number;
    name: string;
    active: boolean;
    users: number[];

    constructor(data) {
        Object.assign(this, data);
        this.users = (data.users && Array.isArray(data.users) ? data.users : []);
    }
}

export class UserGroupListModel {
    id: number;
    name: string;
    active: boolean;
    createdDate: Date;
    updatedDate: Date;
    updatedUser: string;
    users: UserModel[];
    constructor(data) {
        Object.assign(this, data);
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? data.active : true);
        this.users = (data.users && Array.isArray(data.users) ? data.users.map(c => new UserModel(c)) : []);
    }
}

