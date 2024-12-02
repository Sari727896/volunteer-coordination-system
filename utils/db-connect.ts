import { MongoClient, MongoClientOptions } from "mongodb";

const DB_PASSWORD = "xp46o4zCEuRLjtg7";
const DB_URL = `mongodb+srv://sari896job:${DB_PASSWORD}@saricohen.s9qy0p7.mongodb.net/?retryWrites=true&w=majority`;

const options: MongoClientOptions = {
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  serverSelectionTimeoutMS: 5000,
};

export default class DbConnect {
  private dbConn: MongoClient;
  constructor() {
    this.dbConn = new MongoClient(DB_URL, options);
  }
  public async init() {
    await this.dbConn.connect();
    console.log("DB is connected");
  }
  public getDb(dbName: string = "volunteer_coordination_system") {
    return this.dbConn.db(dbName);
  }
  public async terminate() {
    await this.dbConn.close();
    console.log("DB closed successfully");
  }
}
