import { Profile } from "./profile";

export interface activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;

    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees: Profile[];
}

export class activity implements activity {
    /**
     *
     */
    constructor(init?: ActivityFormValues) {
        Object.assign(this, init);
    }
}

export class ActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    city: string = '';
    venue: string = '';
    date: Date | null = null;

    constructor(activity?: ActivityFormValues) {
        if(activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.category = activity.category;
            this.description = activity.description;
            this.city = activity.city;
            this.venue = activity.venue;
            this.date = activity.date;
        }
    }
}