import RequestDal from "../Dal/requests-dal";
import { Priority, Status } from "../utils/enums";
import { HelpRequest, NewHelpRequest } from "../utils/type";

export default class RequestService {
    constructor(private requestDal: RequestDal) {}

    public async getOpenRequest() {
        return this.requestDal.getOpenRequest();
    }

    public async GetByFiltering(location: string, status: Status, priority: Priority) {
        return this.requestDal.GetByFiltering(location, status, priority);
    }

    public async getRequestById(id: string) {
        return this.requestDal.getRequestById(id);
    }

    public async createHelpRequest(request: NewHelpRequest) {
        return this.requestDal.createHelpRequest(request);
    }

    public async volunteerForRequest(requestId: string, volunteerId: string) {
        return this.requestDal.volunteerForRequest(requestId, volunteerId);
    }

    public async closeRequest(requestId: string): Promise<HelpRequest | null> {
        return this.requestDal.closeRequest(requestId);
    }
}
