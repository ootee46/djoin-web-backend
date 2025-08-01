export class ApproverStepItemModel{
    id: number;
    title: string;
    type: string;
    stepType: string;
    userId: number;
    pos: number;
    approverPositionId: number;
    approverGroupId: number;
    active: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    approverGroupName: string;
    approverPositionName: string;
    name: string;
    constructor(data){
        Object.assign(this,data);
        if(data.active == null){
            this.active = true;
        }
    }
}

export class ApproverStepItemListModel{
    id: number;
    title: string;
    type: string;
    stepType: string;
    pos: number;
    userId: number;
    approverPositionId: number;
    approverGroupId: number;
    active: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    approverGroupName: string;
    approverPositionName: string;
    name: string;
    constructor(data){
        Object.assign(this,data);
    }
}

export class ApproverStepItemFormModel{
    id: number;
    title: string;
    pos: number;
    type: string;
    stepType: string;
    userId: number;
    approverPositionId: number;
    approverGroupId: number;
    active: boolean;
    constructor(data){
        Object.assign(this,data);
        if(data.active == null){
            data.active = true;
        }
    }
}
