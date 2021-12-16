import React from "react";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css"
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Route, Switch, useLocation } from "react-router-dom";
import homePage from "../../features/home/homePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/Details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import { ToastContainer } from "react-toastify";
import NotFoundPage from "../../features/errors/NotFoundPage";
import ServerErrorPage from '../../features/errors/ServerErrorPage'

function App() {
  const location = useLocation();
  return (
    <>
    <ToastContainer position="bottom-right" hideProgressBar />
      <Route exact path={["/", "/home"]} component={homePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  key={location.key}
                  path={["/createActivity", "/edit-activity/:id"]}
                  component={ActivityForm}
                />
                <Route path="/errors" component={TestErrors} />
                <Route path='/server-error' component={ServerErrorPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
