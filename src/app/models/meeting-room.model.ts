import { UserModel } from './user.model';

export class MeetingRoomModel {
    id: number;
    name: string;
    color: string;
    colorClass: string;
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
        this.color = (data.color ? data.color : '#000000');
        this.active = (typeof (data.active) == 'boolean' ? data.active : true);
        this.users = (data.users && Array.isArray(data.users) ? data.users.map(c => new UserModel(c)): []);
    }
}

export class MeetingRoomFormModel {
    id: number;
    name: string;
    color: string;
    colorClass: string;
    active: boolean;
    users: number[];

    constructor(data) {
        Object.assign(this, data);
        this.users = (data.users && Array.isArray(data.users) ? data.users : []);
    }
}

export class MeetingRoomListModel {
    id: number;
    name: string;
    color: string;
    colorClass: string;
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

