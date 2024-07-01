import { Collection } from "mongodb";
import DbConnect from "../utils/db-connect";
import { HelpRequest } from "../utils/type";
import { Priority, Status } from "../utils/enums";
const REQUESTS_COLLECTION_NAME = "requests"
export default class RequestDal{
    private collection:Collection<HelpRequest>
    constructor(dbConnection:DbConnect)
    {
        this.collection = dbConnection.getDb().collection(REQUESTS_COLLECTION_NAME)
    }
    public async getOpenRequest()
    {
        try{
            const result = await this.collection.find({ status: { $ne: Status.Closed } }).toArray();
            return result
        }
        catch(err: any){
            throw new Error(`Failed to fetch the unanswered requests from DB: ${err}`);
        }
    }
    public async GetByFiltering( location:string, status:Status,priority:Priority)
    {
         try{
            const result = await this.collection.find({ location, status,priority}).toArray();
            return result
        }
        catch(err: any){
            throw new Error(`Failed to fetch the filtering requests from DB: ${err}`);
        }
    }
}