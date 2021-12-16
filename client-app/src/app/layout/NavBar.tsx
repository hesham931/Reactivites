import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";
export default function NavBar() {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to="/" exact header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="activities" />
        <Menu.Item as={NavLink} to="/errors" name="errors" />
        <Menu.Item>
          <Button
            positive
            content="Create Activity"
            as={Link}
            to="/createActivity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
