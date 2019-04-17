import React from 'react';
import { Container, Image } from 'semantic-ui-react';

import cat from '../images/animals/cat.png';
import cow from '../images/animals/cow.png';
import horse from '../images/animals/horse.png';

const List = () => (
  <Container>
    <Image.Group size="small">
      <Image src={cat} />
      <Image src={horse} />
      <Image src={cow} />
    </Image.Group>
  </Container>
);

export default List;
