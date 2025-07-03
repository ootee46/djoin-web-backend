export class MasterListModel {
    id: number;
    name: string;
    active: boolean;
    updatedDate: Date;
    constructor(data) {
        Object.assign(this, data);
    }
}
