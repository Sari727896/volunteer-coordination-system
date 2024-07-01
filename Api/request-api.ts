import {Router, Request, Response} from 'express';
import RequestService from '../Service/requests-service';
import { HelpRequest } from '../utils/type';
import { Priority, Status } from '../utils/enums';
export default class RequestsApi{
    public router: Router;
    constructor(private requestsService: RequestService) {
        this.router = Router();
        this.setRouts();
    }
    private setRouts() {
        this.router.get('/open', async(req: Request,res:Response) => {
            try{
                let results:Array<HelpRequest>;
                results= await this.requestsService.getOpenRequest();
                res.send(results);
            }
            catch(err:any){
                res.status(500).send(err.message);
            }
        });
        this.router.get('/filtering', async(req: Request,res:Response) => {
            try{
                const { location, status, priority } = req.query;
                const stringLocation = String(location)
                const statusStatus =status as Status;
                const priorityPriority = priority as Priority;
                let results:Array<HelpRequest>;
                results= await this.requestsService.GetByFiltering(stringLocation, statusStatus, priorityPriority);;
                res.send(results);
            }
            catch(err:any){
                res.status(500).send(err.message);
            }
        });
                
    }
    }

