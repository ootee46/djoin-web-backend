export class ErrorModel {
    code: string;
    messageTH: string;
    messageEN: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
