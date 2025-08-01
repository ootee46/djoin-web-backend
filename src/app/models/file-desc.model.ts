export class FileDescModel{
    id: number;
    title: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
