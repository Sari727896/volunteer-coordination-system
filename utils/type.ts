import { Status,Priority } from "./enums";

export interface HelpRequest {
    _id: string,
    title: string,
    description: string,
    location: string,
    status: Status, // Options: "open", "in progress", "closed"
    priority: Priority, // Options: "low", "medium", "high"
    volunteerId: string // ID of the volunteer (if assigned)
}