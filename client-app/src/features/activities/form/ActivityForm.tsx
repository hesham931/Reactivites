import React, { ChangeEvent, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Segment, Form, Button } from "semantic-ui-react";
import { activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const { submiting, loadActivity, createActivity, EditActivity, loadingInitial } =
    activityStore;

  const history = useHistory();

  const [Activity, setActivity] = React.useState<activity>({
    id: "",
    title: "",
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
  });

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [loadActivity, id]);

  function handleForm() {
    if (Activity.id.length === 0) {
      const newActivity = {
        ...Activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      EditActivity(Activity).then(() =>
        history.push(`/activities/${Activity.id}`)
      );
    }
  }

  const handleInputs = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setActivity({ ...Activity!, [name]: value });
  };

  if(loadingInitial && id) return <LoadingComponent content="Loading information..." />
  return (
    <Segment clearing>
      <Form onSubmit={handleForm} autoComplete="off">
        <Form.Input
          placeholder="Title"
          value={Activity!.title}
          name="title"
          onChange={handleInputs}
        />
        <Form.TextArea
          placeholder="Description"
          value={Activity!.description}
          name="description"
          onChange={handleInputs}
        />
        <Form.Input
          placeholder="Category"
          value={Activity!.category}
          name="category"
          onChange={handleInputs}
        />
        <Form.Input
          placeholder="Date"
          value={Activity!.date}
          name="date"
          type="date"
          onChange={handleInputs}
        />
        <Form.Input
          placeholder="City"
          value={Activity!.city}
          name="city"
          onChange={handleInputs}
        />
        <Form.Input
          placeholder="Venue"
          value={Activity!.venue}
          name="venue"
          onChange={handleInputs}
        />

        <Button
          loading={submiting}
          floated="right"
          positive
          type="submit"
          content="submit"
          style={{ marginTop: "5px" }}
        />
        <Button
          type="button"
          content="Back"
          style={{ float: "right", marginTop: "5px" }}
          as={Link}
          to={"/activities"}
        />
      </Form>
    </Segment>
  );
});