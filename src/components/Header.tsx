import React from 'react';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';

const HeaderComponent = () => (
  <Segment inverted textAlign="center" style={{ padding: '3em 0em' }} vertical>
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
      <Button primary size="huge">
        <Icon name="cloud upload" />
        Upload your images
      </Button>
      <Button size="huge" basic inverted>
        <Icon name="images outline" />
        Load example images
      </Button>
    </Container>
  </Segment>
);

export default HeaderComponent;
