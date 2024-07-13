import express, { Application } from 'express';
import RequestsApi from './Api/request-api';
import RequestDal from './Dal/requests-dal';
import RequestService from './Service/requests-service';
import DbConnect from './utils/db-connect';

const HOST = 'localhost';
const PORT = 8080;

export default class App {
    private dbConn?: DbConnect;
    private app?: Application;

    constructor() {}
    async init() {
        this.dbConn = new DbConnect();
        try {
            await this.dbConn.init();
            const requestsDal = new RequestDal(this.dbConn);
            const requestsService = new RequestService(requestsDal);
            const requestApi = new RequestsApi(requestsService);

            this.app = express();
            this.app.use(express.json()); // Add this line to parse JSON bodies
            this.app.use('/api/requests', requestApi.router);
            this.app.listen(PORT, () => {
                console.log('Server is up');
            });
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
    }
    public async terminate() {
        await this.dbConn?.terminate();
    }
}
