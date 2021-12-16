import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Item, Segment, Image } from "semantic-ui-react";
import { activity } from "../../../app/models/activity";

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
    return (
        <Segment.Group>
            <Segment basic attached="top" style={{ padding: "0" }}>
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
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached="bottom">
                <Button color="teal">Join Activity</Button>
                <Button>Cancel attendance</Button>
                <Button color="orange" floated="right" as={Link} to={`/edit-activity/${Activity.id}`}>
                    Manage Event
                </Button>
            </Segment>
        </Segment.Group>
    );
});
