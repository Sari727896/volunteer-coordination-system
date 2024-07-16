import VolunteerDal from "../Dal/volunteer-dal";
import { Volunteer } from "../utils/type";


export default class VolunteerService {
    constructor(private volunteerDal: VolunteerDal) {}

    public async createVolunteer(volunteer: Volunteer) {
        return this.volunteerDal.createVolunteer(volunteer);
    }
}
