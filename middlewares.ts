import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { Status, Priority } from './utils/enums';
import { HelpRequest } from './utils/type';

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
    console.log(`Received ID: ${id}`); // Debug logging
    if (!ObjectId.isValid(id)) {
        console.log(`Invalid ID format for ID: ${id}`); // More detailed logging
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
