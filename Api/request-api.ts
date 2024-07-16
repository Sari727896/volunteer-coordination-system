import { Router, Request, Response } from 'express';
import RequestService from '../Service/requests-service';
import { HelpRequest, NewHelpRequest } from '../utils/type';
import { Priority, Status } from '../utils/enums';
import { validateRequestQuery, validateRequestId, validateRequestBody, validateRequestNotClosed, sendEmailNotification } from '../middlewares';

export default class RequestsApi {
    public router: Router;

    constructor(private requestsService: RequestService) {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.get('/open', async (req: Request, res: Response) => {
            try {
                let results: Array<HelpRequest>;
                results = await this.requestsService.getOpenRequest();
                res.send(results);
            } catch (err: any) {
                res.status(500).send(err.message);
            }
        });

        this.router.get('/filtering', validateRequestQuery, async (req: Request, res: Response) => {
            try {
                const { location, status, priority } = req.query;
                const stringLocation = String(location);
                const statusStatus = status as Status;
                const priorityPriority = priority as Priority;
                let results: Array<HelpRequest>;
                results = await this.requestsService.GetByFiltering(stringLocation, statusStatus, priorityPriority);
                res.send(results);
            } catch (err: any) {
                res.status(500).send(err.message);
            }
        });

        this.router.get('/:id', validateRequestId, async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                console.log(`Handling request for ID: ${id}`); // Debug logging
                const result = await this.requestsService.getRequestById(id);
                if (result) {
                    res.send(result);
                } else {
                    res.status(404).send("Request not found");
                }
            } catch (err: any) {
                console.error(`Error handling request for ID ${req.params.id}:`, err); // Debug logging
                res.status(500).send(err.message);
            }
        });

        this.router.post('/raise', validateRequestBody, async (req: Request, res: Response) => {
            try {
                const newRequest = req.body as NewHelpRequest;
                const result = await this.requestsService.createHelpRequest(newRequest);
                res.status(201).send(result);
            } catch (err: any) {
                res.status(500).send(err.message);
            }
        });

        this.router.post('/volunteer', async (req: Request, res: Response) => {
            const { requestId, volunteerId } = req.body;
            console.log(`Request Body: ${JSON.stringify(req.body)}`); // Log request body
            if (!requestId || !volunteerId) {
                return res.status(400).send("Request ID and Volunteer ID are required");
            }

            try {
                const result = await this.requestsService.volunteerForRequest(requestId, volunteerId);
                if (result) {
                    console.log(`Response: ${JSON.stringify(result)}`);
                    res.send(result);
                } else {
                    console.log("Request not found.");
                    res.status(404).send("Request not found");
                }
            } catch (err: any) {
                console.error(`Error handling volunteer request: ${err}`);
                res.status(500).send(err.message);
            }
        });

        this.router.post('/:id/close', validateRequestId, validateRequestNotClosed, sendEmailNotification, async (req: Request, res: Response) => {
            const { id } = req.params;
            try {
                const result = await this.requestsService.closeRequest(id);
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send("Request not found");
                }
            } catch (err: any) {
                res.status(500).send(err.message);
            }
        });

        // Test route to isolate validation
        this.router.get('/test/:id', validateRequestId, (req: Request, res: Response) => {
            res.send("Valid ID format");
        });
    }
}
