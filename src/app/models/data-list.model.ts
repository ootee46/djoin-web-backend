export class DataListModel<T>
{
    totalRecord: number;
    maxPos: number;
    pageSize: number;
    page: number;
    datas: T[];
    constructor(data,myClass: (new ({}) => T)){
        this.totalRecord = data.totalRecord || 0;
        this.maxPos = data.maxPos || 0;
        this.pageSize = data.pageSize || 0;
        this.page = data.page || 0;
        if(data.datas && Array.isArray(data.datas) && data.datas.length > 0)
        {
            this.datas = data.datas.map(c=>new myClass(c));
        }else{
            this.datas = [];
        }
    }
}
