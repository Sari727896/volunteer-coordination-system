
import RequestsApi from './Api/request-api';
import RequestDal from './Dal/requests-dal';
import RequestService from './Service/requests-service';
import DbConnect from './utils/db-connect';
import express, { Application } from "express";

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
    }
    public async terminate() {
        await this.dbConn?.terminate();
    }
}
// async function main() {
//     const dbConnect = new DbConnect();

//     try {
//         await dbConnect.init(); // מתחבר למסד הנתונים

//         // יצירת אוסף (Collection) חדש לדוגמה
//         const db = dbConnect.getDb();
//         console.log(db);
//         const collectionName = 'requests';
//         const collection = db.collection(collectionName);

//         // יצירת מסמך חדש להוספה לאוסף
//         const doc = {  title: 'help',description:'we need some help',location:'Jerusalem' };
//         const result = await collection.insertOne(doc);
//         console.log(`Inserted document with _id: ${result.insertedId}`);

//         // בדיקת שימוש לאחר הכנסת המסמך
//         // const query = { name: 'John Doe' };
//         // const foundDoc = await collection.findOne(query);
//         // console.log('Found document:', foundDoc);

//     } catch (error) {
//         console.error('Error occurred:', error);
//     } finally {
//         await dbConnect.terminate(); // סגירת חיבור למסד הנתונים
//     }
// }

// main().catch(console.error);
