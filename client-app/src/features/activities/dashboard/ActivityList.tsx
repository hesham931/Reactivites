import React, { Fragment } from "react";
import { Header } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";

export default observer(function ActivityList() {
  const { activityStore } = useStore();
  const { groupedActivities, loadingInitial } = activityStore;

  if (loadingInitial)
    return <LoadingComponent content="Loading Activities..." />;
  return (
    <>
      {groupedActivities.map(([groupBy, activities]) => (
        <Fragment key={groupBy}>
          <Header sub color="teal">
            {groupBy}
          </Header>
          {activities.map(Activity => (
            <ActivityListItem key={Activity.id} Activity={Activity} />
          ))}
        </Fragment>
      ))}
    </>
  );
});
