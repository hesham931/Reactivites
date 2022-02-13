import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import ActivityDetailedHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity: activity, loadActivity, loadingInitial, clearSelectedActivity } = activityStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }

    return () => clearSelectedActivity();
  }, [id, loadActivity, clearSelectedActivity]);

  if (loadingInitial || !activity)
    return <LoadingComponent content="Loading Activity" />;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader Activity={activity} />
        <ActivityDetailedInfo Activity={activity} />
        <ActivityDetailedChat activityId={activity.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar Activity={activity} />
      </Grid.Column>
    </Grid>
  );
})
