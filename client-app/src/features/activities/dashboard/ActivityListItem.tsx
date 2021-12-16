import React from "react";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { activity } from "../../../app/models/activity";

interface Props {
    Activity: activity;
}

export default function ActivityListItem({ Activity }: Props) {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src="/assets/user.png" />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${Activity.id}`}>
                                {Activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by Bob</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {Activity.date}
                    <Icon name="marker" /> {Activity.venue}
                </span>
            </Segment>
            <Segment secondary>Attendees Go Here</Segment>
            <Segment clearing>
                <span>{Activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${Activity.id}`}
                    color="teal"
                    content="View"
                    floated="right"
                />
            </Segment>
        </Segment.Group>
    );
}
