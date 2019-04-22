import React from 'react';
import { Container, Segment } from 'semantic-ui-react';

const Footer = () => (
  <Segment inverted vertical className="footer">
    <Container text textAlign="center">
      This site is not affiliated in any way with Dobble, Spot It!, its creators
      or distributors.
      <br />
      Dobble and Spot It! are trademarks of ASMODEE GROUP.
      <br />
      Example images by{' '}
      <a href="https://icons8.com/" target="_blank">
        icons8.com
      </a>
    </Container>
  </Segment>
);

export default Footer;
