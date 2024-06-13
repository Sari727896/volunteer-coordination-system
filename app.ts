// app.ts

import DbConnect from './utils/db-connect';

async function main() {
    const dbConnect = new DbConnect();

    try {
        await dbConnect.init(); // מתחבר למסד הנתונים

        // יצירת אוסף (Collection) חדש לדוגמה
        const db = dbConnect.getDb();
        console.log(db);
        const collectionName = 'requests';
        const collection = db.collection(collectionName);

        // יצירת מסמך חדש להוספה לאוסף
        const doc = {  title: 'help',description:'we need some help',location:'Jerusalem' };
        const result = await collection.insertOne(doc);
        console.log(`Inserted document with _id: ${result.insertedId}`);

        // בדיקת שימוש לאחר הכנסת המסמך
        // const query = { name: 'John Doe' };
        // const foundDoc = await collection.findOne(query);
        // console.log('Found document:', foundDoc);

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await dbConnect.terminate(); // סגירת חיבור למסד הנתונים
    }
}

main().catch(console.error);
