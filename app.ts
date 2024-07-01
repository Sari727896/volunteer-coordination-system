
import RequestsApi from './Api/request-api';
import RequestDal from './Dal/requests-dal';
import RequestService from './Service/requests-service';
import DbConnect from './utils/db-connect';
import express, { Application } from "express";
import { Priority, Status } from './utils/enums';

const HOST="localhost";
const PORT=8080;
export default class App{
    private dbConn?: DbConnect;
    private app?: Application;

    constructor() {}
    async init() {
        this.dbConn = new DbConnect();
        await this.dbConn.init();

        const requestsDal = new RequestDal(this.dbConn);
        const requestsService = new RequestService(requestsDal);
        const requestApi = new RequestsApi(requestsService);

        this.app = express();
        this.app.use('/api/requests', requestApi.router);
        this.app.listen(PORT, () => {
            console.log("Server is up");
        });
        // this.insertDocument(this.dbConn);
    }
    public async terminate() {
        await this.dbConn?.terminate();
    }
    public async insertDocument(dbConn:DbConnect)
    {
        try {
            const collectionName = 'requests';
            const collection = dbConn.getDb().collection(collectionName);
    
    //         // יצירת מסמך חדש להוספה לאוסף
            const doc = {  title: 'help',description:'we need some help',location:'Tverya',status:Status.Closed,priority:Priority.Low};
            const result = await collection.insertOne(doc);
            console.log(`Inserted document with _id: ${result.insertedId}`);
            const doc1 = {  title: 'help',description:'we need some help',location:'Tel-Aviv',status:Status.Closed,priority:Priority.Medium};
            const  result1= await collection.insertOne(doc1);
    
       } catch (error) {
           console.error('Error occurred:', error);
       }
      
    }
    

}


   
//  finally {
// //         await dbConnect.terminate(); // סגירת חיבור למסד הנתונים
// //     }


// main().catch(console.error);
