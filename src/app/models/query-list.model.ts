/* eslint-disable @typescript-eslint/naming-convention */
export class QueryListModel{
    id: number;
    kw: string;
    page: number;
    pageSize: number;
    sort: string;
    dir: string;
    catId: number;
    catId2: number;
    statusId: number;
    status: string;
    start_date: string;
    end_date: string;
    start_date2: string;
    end_date2: string;
    fieldsort:string;
    constructor(data){
        this.id = (typeof(data.id) == 'number' ? data.id : null);
        this.kw = data.kw || null;
        this.page = (typeof(data.page) == 'number' ? data.page : 0);
        this.pageSize = (typeof(data.pageSize) == 'number' ? data.pageSize : 100);
        this.sort = data.sort || null;
        this.dir = data.dir || null;
        this.catId = data.catId || null;
        this.catId2 = data.catId2 || null;
        this.status = data.status || null;
        this.statusId = data.statusId || null;
        this.fieldsort = null;
    }
}
