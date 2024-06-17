import {Router, Request, Response} from 'express';
import RequestService from '../Service/requests-service';
import { HelpRequest } from '../utils/type';
export default class RequestsApi{
    public router: Router;
    constructor(private requestsService: RequestService) {
        this.router = Router();
        this.setRouts();
    }
    private setRouts() {
        this.router.get('/', async(req: Request,res:Response) => {
            try{
                let results:Array<HelpRequest>;
                results= await this.requestsService.getOpenRequest();
                res.send(results);
            }
            catch(err:any){
                res.status(500).send(err.message);
            }
        });
    }
    }

