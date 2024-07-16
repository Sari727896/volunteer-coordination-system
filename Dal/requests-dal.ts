import { Collection, ObjectId, InsertOneResult, FindOneAndUpdateOptions } from "mongodb";
import DbConnect from "../utils/db-connect";
import { HelpRequest, NewHelpRequest } from "../utils/type";
import { Priority, Status } from "../utils/enums";

const REQUESTS_COLLECTION_NAME = "requests";

export default class RequestDal {
    private collection: Collection<HelpRequest>;

    constructor(dbConnection: DbConnect) {
        this.collection = dbConnection.getDb().collection(REQUESTS_COLLECTION_NAME);
    }

    public async getOpenRequest() {
        try {
            const result = await this.collection.find({ status: { $ne: Status.Closed } }).toArray();
            return result;
        } catch (err: any) {
            throw new Error(`Failed to fetch the unanswered requests from DB: ${err}`);
        }
    }

    public async GetByFiltering(location: string, status: Status, priority: Priority) {
        try {
            const result = await this.collection.find({ location, status, priority }).toArray();
            return result;
        } catch (err: any) {
            throw new Error(`Failed to fetch the filtering requests from DB: ${err}`);
        }
    }

    public async getRequestById(id: string) {
        try {
            const objectId = new ObjectId(id);
            const result = await this.collection.findOne({ _id: objectId });
            return result;
        } catch (err: any) {
            throw new Error(`Failed to fetch the request by ID from DB: ${err}`);
        }
    }

    public async createHelpRequest(request: NewHelpRequest): Promise<HelpRequest> {
        try {
            const newRequest = {
                ...request,
                status: Status.Open, // Default status to open
                volunteerId: "", // Default volunteerId to empty
            };

            const result: InsertOneResult<NewHelpRequest> = await this.collection.insertOne(newRequest as HelpRequest);
            return {
                ...newRequest,
                _id: result.insertedId,
            } as HelpRequest;
        } catch (err: any) {
            throw new Error(`Failed to create a new help request: ${err}`);
        }
    }

    public async volunteerForRequest(requestId: string, volunteerId: string): Promise<HelpRequest | null> {
        try {
            const objectId = new ObjectId(requestId);
            console.log(`ObjectId: ${objectId}`); // Log ObjectId

            const updateResult = await this.collection.findOneAndUpdate(
                { _id: objectId },
                { $set: { status: Status.InProgress, volunteerId: volunteerId } },
                { returnDocument: 'after' } as FindOneAndUpdateOptions
            );

            console.log(`Update Result: ${JSON.stringify(updateResult)}`); // Log result
            if (updateResult ) {
                return updateResult as HelpRequest;
            } else {
                console.log(" after update.");
                return null;
            }
        } catch (err: any) {
            console.error(`Failed to update the request with volunteer information: ${err}`);
            throw new Error(`Failed to update the request with volunteer information: ${err}`);
        }
    }
}
