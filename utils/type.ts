import { ObjectId } from 'mongodb';
import { Status, Priority } from './enums';

export interface HelpRequest {
    _id: ObjectId,
    title: string,
    description: string,
    location: string,
    status: Status,
    priority: Priority,
    volunteerId: string
}

export type NewHelpRequest = Omit<HelpRequest, '_id'>;

 export interface Volunteer {
    name: string;
    email: string;
    phone: string;
}