import React, { FC } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Divider,
  Icon,
  Image,
  Segment,
} from 'semantic-ui-react';

import {
  loadExamples,
  removeAll,
  removeImage,
  uploadImages,
} from '../api/actions';
import { State } from '../api/store';
import { CardImage } from '../api/types';
import Settings from './Settings';

interface Props {
  images: CardImage[];
  loadExamples: typeof loadExamples;
  removeAll: typeof removeAll;
  removeImage: typeof removeImage;
  uploadImages: typeof uploadImages;
}

const Files: FC<Props> = ({
  images,
  loadExamples,
  removeAll,
  removeImage,
  uploadImages,
}) => (
  <Container className="pusher">
    <Divider horizontal>
      <Button.Group size="huge">
        <Button primary as="label" htmlFor="fileUpload">
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

    <input
      type="file"
      id="fileUpload"
      onChange={e => uploadImages(e.target.files)}
      multiple
      style={{ display: 'none' }}
      accept=".png,.jpg,.jpeg"
    />

    <Segment basic textAlign="center">
      <Image.Group size="tiny">
        {images.map(({ id, base64src, title }) => (
          <Image
            key={id}
            src={base64src}
            onClick={() => removeImage(id)}
            className="preview"
            title={title}
            alt={title}
          />
        ))}
      </Image.Group>
      {images.length > 0 && (
        <>
          <Button onClick={removeAll}>
            <Icon name="trash" />
            Remove all images
          </Button>
          <Settings />
        </>
      )}
    </Segment>
  </Container>
);

export default connect((state: State) => ({ images: state.images }), {
  removeAll,
  loadExamples,
  uploadImages,
  removeImage,
})(Files);
