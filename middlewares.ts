import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { Status, Priority } from './utils/enums';
import DbConnect from './utils/db-connect';
import EmailService from './Service/email-service';

const dbConnect = new DbConnect();
dbConnect.init(); // Ensure the database connection is initialized

// Middleware to validate location, status, and priority in query parameters
export function validateRequestQuery(req: Request, res: Response, next: NextFunction) {
    const { location, status, priority } = req.query;

    if (location && typeof location !== 'string') {
        return res.status(400).send("Invalid location");
    }

    if (status && !Object.values(Status).includes(status as Status)) {
        return res.status(400).send("Invalid status");
    }

    if (priority && !Object.values(Priority).includes(priority as Priority)) {
        return res.status(400).send("Invalid priority");
    }

    next();
}

// Middleware to validate request ID
export function validateRequestId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
    }
    next();
}

// Middleware to validate the request body for creating a new help request
export function validateRequestBody(req: Request, res: Response, next: NextFunction) {
    const { title, description, location, priority } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).send("Invalid title");
    }

    if (!description || typeof description !== 'string') {
        return res.status(400).send("Invalid description");
    }

    if (!location || typeof location !== 'string') {
        return res.status(400).send("Invalid location");
    }

    if (!priority || !Object.values(Priority).includes(priority)) {
        return res.status(400).send("Invalid priority");
    }

    next();
}

// Middleware to validate if the request is already closed
export async function validateRequestNotClosed(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
        const objectId = new ObjectId(id);
        const collection = dbConnect.getDb().collection('requests');
        const request = await collection.findOne({ _id: objectId });

        if (!request) {
            return res.status(404).send("Request not found");
        }

        if (request.status === Status.Closed) {
            return res.status(400).send("The request is already closed");
        }

        next();
    } catch (err:any) {
        res.status(500).send(`Failed to validate request status: ${err.message}`);
    }
}

// Middleware to send email notification to the volunteer when the request is closed
export async function sendEmailNotification(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
        console.log('sendEmailNotification middleware called');
        const objectId = new ObjectId(id);
        const collection = dbConnect.getDb().collection('requests');
        const request = await collection.findOne({ _id: objectId });

        if (request) {
            console.log('Request found:', request);

            if (request.volunteerId) {
                const volunteersCollection = dbConnect.getDb().collection('volunteers');
                const volunteer = await volunteersCollection.findOne({ _id: new ObjectId(request.volunteerId) });

                if (volunteer && volunteer.email) {
                    await EmailService.sendEmail(
                        volunteer.email,
                        'Request Closed Notification',
                        `Hello,\n\nThe request titled "${request.title}" has been marked as closed.\n\nThank you for your support!`
                    );
                } else {
                    console.error('Volunteer not found or email missing.');
                }
            } else {
                console.error('Volunteer ID not found in request.');
            }
        }

        next();
    } catch (err:any) {
        console.error('Failed to send email notification:', err.message);
        res.status(500).send(`Failed to send email notification: ${err.message}`);
    }
}

// Middleware to validate the request body for creating a new volunteer
export function validateVolunteerBody(req: Request, res: Response, next: NextFunction) {
    const { name, email, phone } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).send("Invalid name");
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).send("Invalid email");
    }

    if (!phone || typeof phone !== 'string') {
        return res.status(400).send("Invalid phone");
    }

    next();
}
