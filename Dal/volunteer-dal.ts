import { Collection, InsertOneResult } from "mongodb";
import DbConnect from "../utils/db-connect";
import { Volunteer } from "../utils/type";

const VOLUNTEERS_COLLECTION_NAME = "volunteers";

export default class VolunteerDal {
  private collection: Collection<Volunteer>;

  constructor(dbConnection: DbConnect) {
    this.collection = dbConnection
      .getDb()
      .collection(VOLUNTEERS_COLLECTION_NAME);
  }

  public async createVolunteer(volunteer: Volunteer): Promise<Volunteer> {
    try {
      const result: InsertOneResult<Volunteer> =
        await this.collection.insertOne(volunteer);
      return {
        ...volunteer,
        _id: result.insertedId,
      } as Volunteer;
    } catch (err: any) {
      throw new Error(`Failed to create a new volunteer: ${err}`);
    }
  }
}
