import React from 'react';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';

const HeaderComponent = () => (
  <Segment inverted textAlign="center" vertical className="header">
    <Container text>
      <Header
        as="h1"
        content="Dobble-like generator"
        inverted
        className="title"
      />
      <Header
        as="h2"
        content="Prepare and print cards with your own images"
        inverted
        className="subtitle"
      />
    </Container>
  </Segment>
);

export default HeaderComponent;
