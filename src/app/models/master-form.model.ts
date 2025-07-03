export class MasterFormModel
{
    id: number;
    name: string;
    active: boolean;
    constructor(data) {
        Object.assign(this, data);
    }
}
