import RequestDal from "../Dal/requests-dal";
import { Priority, Status } from "../utils/enums";

export default class RequestService{
    constructor(private requestDal: RequestDal)
    {
    }
    public async getOpenRequest()
    {
        return  this.requestDal.getOpenRequest();
    }
    public async GetByFiltering( location:string, status:Status,priority:Priority)
    {
        return this.requestDal.GetByFiltering(location,status,priority);
    }
}