import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { activity, ActivityFormValues } from "../models/activity";
import { Profile } from "../models/profile";
import { store } from "./store";

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

            activities.forEach(Activity => {
                this.setActivity(Activity);
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

    createActivity = async (Activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);

        try {
            await agent.Activities.create(Activity);
            const newActivity = new activity(Activity);
            newActivity.hostUsername = user!.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) { console.log(error) }
    }

    EditActivity = async (Activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(Activity);
            runInAction(() => {
                if (Activity.id) {
                    let updatedActivity = { ...this.getActivity(Activity.id)!, ...Activity }
                    this.activityRegestry.set(Activity.id, updatedActivity);
                    this.selectedActivity = updatedActivity;
                }
            })
        } catch (error) { console.log(error) }
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
        const user = store.userStore.user;
        if (user) {
            Activity.isGoing = Activity.attendees!.some(
                a => a.userName === user.userName
            );
            Activity.isHost = Activity.hostUsername === user.userName;
            Activity.host = Activity.attendees!.find(
                a => a.userName === Activity.hostUsername
            );
        }

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

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                //activities => its the array of objects that will contain the result of type {} as {[key: string]: activity[]} key and value(date: array of activities)
                //activity => will itreator on activities in the array
                //console.log(activities);
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: activity[] })
        );
    }

    private setLoadActivity = (state: boolean) => {
        runInAction(() => this.loadingInitial = state)
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        runInAction(() => this.submiting = true);

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
                        a => a.userName !== user?.userName
                    );
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegestry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => runInAction(() => this.submiting = false))
        }
    }

    cancelActivityToggle = async () => {
        runInAction(() => this.submiting = true);
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activityRegestry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        }catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.submiting = false)
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
    updateAttendeeFollowing = (username: string) => {
        this.activityRegestry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.userName === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }
}