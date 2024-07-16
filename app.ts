import express, { Application } from 'express';
import RequestsApi from './Api/request-api';
import RequestDal from './Dal/requests-dal';
import RequestService from './Service/requests-service';
import DbConnect from './utils/db-connect';
import VolunteerDal from './Dal/volunteer-dal';
import VolunteerService from './Service/volunteer-service';
import VolunteersApi from './Api/volunteers-api';

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
            const volunteerDal=new VolunteerDal(this.dbConn);
            const volunteerService=new VolunteerService(volunteerDal);
            const volunteerApi=new VolunteersApi(volunteerService);

            this.app = express();
            this.app.use(express.json()); // Add this line to parse JSON bodies
            this.app.use('/api/requests', requestApi.router);
            this.app.use('/api/volunteer', volunteerApi.router);
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
