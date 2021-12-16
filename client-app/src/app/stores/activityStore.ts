import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { activity } from "../models/activity";

export default class ActivityStore {
    activityRegestry = new Map<string, activity>();
    selectedActivity: activity | undefined = undefined;
    loadingInitial = false;
    submiting = false;

    constructor() {
        /* makeObservable(this, {
            title: observable,
            setTitle: action
        }) */
        //or
        makeAutoObservable(this);
    }

    loadActivities = async () => {
        this.setLoadActivity(true);
        try {
            let activities = await agent.Activities.list();

            activities.forEach(activity => {
                this.setActivity(activity);
            });
            this.setLoadActivity(false);
        } catch (error) {
            console.log('activityStore.ts error in async method ' + error)
            this.setLoadActivity(false);
        };
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadActivity(true)
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadActivity(false);
                return activity;
            } catch (error) { console.log(error); this.setLoadActivity(false) }
        }
    }

    createActivity = async (Activity: activity) => {
        runInAction(() => this.submiting = true);
        try {
            await agent.Activities.create(Activity);
            runInAction(() => {
                this.activityRegestry.set(Activity.id, Activity);
                runInAction(() => this.submiting = false);
            })
        } catch (error) { console.log(error); runInAction(() => this.submiting = false) }
    }

    EditActivity = async (Activity: activity) => {
        runInAction(() => this.submiting = true);
        try {
            await agent.Activities.update(Activity);
            runInAction(() => {
                this.activityRegestry.set(Activity.id, Activity);
                runInAction(() => this.submiting = false);
            })
        } catch (error) { console.log(error); runInAction(() => this.submiting = false); }
    }

    deleteActivity = async (Activity: activity) => {
        runInAction(() => this.submiting = true);
        try {
            await agent.Activities.delete(Activity.id).then(() => {
                runInAction(() => {
                    this.activityRegestry.delete(Activity.id);
                    runInAction(() => this.submiting = false);
                    this.selectedActivity = undefined;
                })
            })
        } catch (error) { console.log(error); runInAction(() => this.submiting = false); }
    }

    private setActivity(Activity: activity) {
        Activity.date = new Date(Activity.date!);
        this.activityRegestry.set(Activity.id, Activity);
    }

    private getActivity(id: string) {
        return this.activityRegestry.get(id);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegestry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                //activities => its the array of objects that will contain the result of type {} as {[key: string]: activity[]} key and value(date: array of activities)
                //activity => will itreator on activities in the array
                //console.log(activities);
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date]? [...activities[date], activity]: [activity];
                return activities;
            }, {} as {[key: string]: activity[]})
        );
    }

    private setLoadActivity = (state: boolean) => {
        runInAction(() => this.loadingInitial = state)
    }
}