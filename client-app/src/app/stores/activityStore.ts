import { format } from "date-fns";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { activity, ActivityFormValues } from "../models/activity";
import { Pagination, PagingParams } from "../models/pagination";
import { Profile } from "../models/profile";
import { store } from "./store";

export default class ActivityStore {
    activityRegestry = new Map<string, activity>();
    selectedActivity: activity | undefined = undefined;
    loadingInitial = false;
    submiting = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        /* makeObservable(this, {
            title: observable,
            setTitle: action
        }) */
        //or
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegestry.clear();
                this.loadActivities();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());

        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString())
            } else {
                params.append(key, value);
            }
        })

        return params;
    }

    loadActivities = async () => {
        this.setLoadActivity(true);
        try {
            const result = await agent.Activities.list(this.axiosParams);

            result.data.forEach(Activity => {
                this.setActivity(Activity);
            });
            this.setPagination(result.pagination)
            this.setLoadActivity(false);
        } catch (error) {
            console.log('activityStore.ts error in async method ' + error)
            this.setLoadActivity(false);
        };
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
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