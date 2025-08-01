/* eslint-disable @typescript-eslint/naming-convention */
export class PageQueryModel{
    page: number;
    page_size: number;
    constructor(data){
        this.page = data.page || 0;
        this.page_size = data.page_size || 50;
    }
}
