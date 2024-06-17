import RequestDal from "../Dal/requests-dal";

export default class RequestService{
    constructor(private requestDal: RequestDal)
    {
    }
    public async getOpenRequest()
    {
        return  this.requestDal.getOpenRequest();
    }
}