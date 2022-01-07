import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Item, Segment, Image, Label } from "semantic-ui-react";
import { activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";

const activityImageStyle = {
    filter: "brightness(30%)",
};

const activityImageTextStyle = {
    position: "absolute",
    bottom: "5%",
    left: "5%",
    width: "100%",
    height: "auto",
    color: "white",
};

interface Props {
    Activity: activity;
}

export default observer(function ActivityDetailedHeader({ Activity }: Props) {
    const { activityStore: { updateAttendance, submiting, cancelActivityToggle } } = useStore();
    return (
        <Segment.Group>
            <Segment basic attached="top" style={{ padding: "0" }}>
                {Activity.isCancelled &&
                    <Label style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
                        ribbon color='red' content='Cancelled' />
                }
                <Image
                    src={`/assets/categoryImages/${Activity.category}.jpg`}
                    fluid
                    style={activityImageStyle}
                />
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size="huge"
                                    content={Activity.title}
                                    style={{ color: "white" }}
                                />
                                <p>{format(Activity.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by
                                    <strong>
                                        <Link to={`/profiles/${Activity.host?.userName}`}>
                                            {Activity.host?.displayName}
                                        </Link>
                                    </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached="bottom">
                {
                    Activity.isHost ? (
                        <>
                            <Button
                                color={Activity.isCancelled ? 'green' : 'red'}
                                floated='left'
                                basic
                                content={Activity.isCancelled ? 'Re-activate Activity' : 'Cancel Activity'}
                                onClick={cancelActivityToggle}
                                loading={submiting}
                            />
                            <Button
                                color="orange"
                                floated="right"
                                as={Link}
                                to={`/edit-activity/${Activity.id}`}
                                disabled={Activity.isCancelled}>
                                Manage Event
                            </Button>
                        </>
                    ) : Activity.isGoing ? (
                        <Button loading={submiting} onClick={updateAttendance}>Cancel attendance</Button>
                    ) : (
                        <Button
                            color="teal"
                            loading={submiting}
                            onClick={updateAttendance}
                            disabled={Activity.isCancelled}>
                            Join Activity
                        </Button>
                    )
                }


            </Segment>
        </Segment.Group>
    );
});
