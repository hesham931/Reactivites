import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Segment, Button, Header } from "semantic-ui-react";
import { activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { CategoryOptions } from "../../../app/common/options/CategoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    submiting,
    loadActivity,
    createActivity,
    EditActivity,
    loadingInitial,
  } = activityStore;

  const history = useHistory();

  const [Activity, setActivity] = React.useState<activity>({
    id: "",
    title: "",
    date: null,
    description: "",
    category: "",
    city: "",
    venue: "",
  });

  const { id } = useParams<{ id: string }>();

  const validationSchema = yup.object({
    title: yup.string().required("The activity title is required"),
    description: yup.string().required("The activity description is required"),
    category: yup.string().required("The activity category is required"),
    date: yup.string().required("The activity date is required").nullable(),
    venue: yup.string().required("The activity venue is required"),
    city: yup.string().required("The activity city is required"),
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [loadActivity, id]);

  function handleForm(Activity: activity) {
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

  /* const handleInputs = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setActivity({ ...Activity!, [name]: value });
  }; */

  if (loadingInitial && id)
    return <LoadingComponent content="Loading information..." />;
  return (
    <Segment clearing>
      <Header content="Activity Details" color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={Activity}
        onSubmit={(values) => handleForm(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="title" />
            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySelectInput
              options={CategoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              showTimeSelect
              timeCaption="time"
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Date"
              name="date"
            />
            <Header content="Location Details" color="teal" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />

            <Button
              disabled={!isValid || !dirty || isSubmitting}
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
        )}
      </Formik>
    </Segment>
  );
});
