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
import { CardImage } from '../api/types';

interface Props {
  images: CardImage[];
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
      <Image.Group size="tiny">
        {images.map(image => (
          <Image key={image.id} src={image.base64src} />
        ))}
      </Image.Group>
      {images.length > 0 && (
        <Button onClick={removeAll}>
          <Icon name="trash" />
          Remove all images
        </Button>
      )}
    </Segment>
    <Segment textAlign="center" raised>
      <Progress
        percent={(images.length / 57) * 100}
        attached="bottom"
        color="blue"
      />
      There must be at least 57 images ({57 - images.length} more) to generate
      the cards.
    </Segment>
  </Container>
);

export default connect(
  (state: State) => ({ images: state.images }),
  { removeAll, loadExamples, uploadImages },
)(Content);
