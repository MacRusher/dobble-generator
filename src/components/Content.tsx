import React, { FC } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Divider,
  Icon,
  Image,
  Progress,
  Segment,
} from 'semantic-ui-react';

import { loadExamples, removeAll, uploadImages } from '../api/actions';
import { State } from '../api/store';

import cat from '../images/animals/cat.png';
import cow from '../images/animals/cow.png';
import horse from '../images/animals/horse.png';

interface Props {
  images: string[];
  loadExamples: typeof loadExamples;
  uploadImages: typeof uploadImages;
  removeAll: typeof removeAll;
}

const Content: FC<Props> = ({
  images,
  removeAll,
  uploadImages,
  loadExamples,
}) => (
  <Container className="content">
    <Divider horizontal>
      <Button.Group size="huge">
        <Button primary onClick={uploadImages}>
          <Icon name="cloud upload" />
          Upload images
        </Button>
        <Button.Or text="or" />
        <Button onClick={loadExamples}>
          <Icon name="images outline" />
          Load examples
        </Button>
      </Button.Group>
    </Divider>
    <Segment basic textAlign="center">
      {JSON.stringify(images)}
      <Image.Group size="tiny">
        <Image src={cat} />
        <Image src={horse} />
        <Image src={cow} />
      </Image.Group>
      <Button onClick={removeAll}>
        <Icon name="trash" />
        Remove all images
      </Button>
    </Segment>
    <Segment textAlign="center" raised>
      <Progress percent={20} attached="bottom" color="blue" />
      There must be at least XX images (x more) to generate the cards.
    </Segment>
  </Container>
);

export default connect(
  (state: State) => ({ images: state.images }),
  { removeAll, loadExamples, uploadImages },
)(Content);
