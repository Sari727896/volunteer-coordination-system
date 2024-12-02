import { Router, Request, Response } from "express";
import VolunteerService from "../Service/volunteer-service";
import { validateVolunteerBody } from "../middlewares";

export default class VolunteersApi {
  public router: Router;

  constructor(private volunteerService: VolunteerService) {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.post(
      "/",
      validateVolunteerBody,
      async (req: Request, res: Response) => {
        const { name, email, phone } = req.body;

        try {
          const result = await this.volunteerService.createVolunteer({
            name,
            email,
            phone,
          });
          res.status(201).send(result);
        } catch (err) {
          console.error("Failed to create a new volunteer:", err);
          res.status(500).send("Internal Server Error");
        }
      }
    );
  }
}
