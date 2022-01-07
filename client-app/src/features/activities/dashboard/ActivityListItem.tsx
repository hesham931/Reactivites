import React from "react";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { activity } from "../../../app/models/activity";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
    Activity: activity;
}

export default function ActivityListItem({ Activity }: Props) {
    return (
        <Segment.Group>
            <Segment>
                {Activity.isCancelled && 
                    <Label
                        attached="top"
                        color='red'
                        content='Cancelled'
                        style={{textAlign: 'center'}}
                    />
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 3}} size="tiny" circular src="/assets/user.png" />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${Activity.id}`}>
                                {Activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by {Activity.host?.displayName}</Item.Description>
                            {Activity.isHost && (
                                <Item.Description>
                                    <Label basic color='orange'>
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {Activity.isGoing && !Activity.isHost && (
                                <Item.Description>
                                    <Label basic color='green'>
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {format(Activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name="marker" /> {Activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={Activity.attendees!} />
            </Segment>
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
