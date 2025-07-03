import { inherits } from 'util';
import { AgendaRequestAttachmentFormModel } from './agenda-request.model';
import { MinuteAttachmentFormModel } from './minute-request.model';

export class ApproveFormModel {
    id: number;
    isApprove: boolean;
    remark: string;

    constructor(data){
        Object.assign(this,data);
        this.id = (data.id ? data.id : 0);
    }
}

export class AgendaApproveFormModel extends ApproveFormModel{
    attachments: AgendaRequestAttachmentFormModel[] = [];
    constructor(data){
        super(data);
        Object.assign(this,data);
    }
}

export class MinuteApproveFormModel extends ApproveFormModel{
    attachments: MinuteAttachmentFormModel[] = [];
    constructor(data){
        super(data);
        Object.assign(this,data);
    }
}


