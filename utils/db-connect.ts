import {MongoClient} from 'mongodb'
const DB_PASSWORD='xp46o4zCEuRLjtg7'
const DB_URL =`mongodb+srv://sari896job:${DB_PASSWORD}@saricohen.s9qy0p7.mongodb.net/?retryWrites=true&w=majority&appName=SariCohen`
const DB_NAME ='volunteer_coordination_system'

export default class DbConnect{
    private dbConn: MongoClient
    constructor()
    {
        this.dbConn = new MongoClient(DB_URL)
    }
    public async init() {
        const res = await this.dbConn.connect();
        console.log("DB is connected");
    }
    public getDb(dbName: string = DB_NAME) {
        return this.dbConn.db(dbName);
    }
    public async terminate() {
        await this.dbConn.close();
        console.log("DB closed successfully");
    }
}
// async function run() {
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         // התחברות לשרת MongoDB
//         await client.connect();

//         // בחירת מסד הנתונים
//         const database = client.db('myDatabase'); // שם מסד הנתונים

//         // בחירת אוסף
//         const collection = database.collection('devices');

//         // הוספת מסמך לדוגמה
//         const doc = { name: 'Example Device', type: 'Sensor' };
//         const result = await collection.insertOne(doc);
//         console.log(`New document inserted with _id: ${result.insertedId}`);
//     } finally {
//         // ניתוק החיבור למסד הנתונים
//         await client.close();
//     }
// }

// run().catch(console.dir);
