import findLastIndex from 'lodash/findLastIndex';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  Progress,
  Segment,
} from 'semantic-ui-react';

import { generatePdf } from '../api/actions';
import { plains } from '../api/lib';
import { State } from '../api/store';
import { CardImage } from '../api/types';

interface Props {
  images: CardImage[];
  plains: typeof plains;
  processing: boolean;
  generatePdf: typeof generatePdf;
}

const Summary: FC<Props> = ({ images, plains, processing, generatePdf }) => {
  const count = images.length;

  const i = findLastIndex(plains, ({ symbols }) => count >= symbols);

  const activePlain = plains[i] || null;
  const nextPlain = plains[i + 1] || null;

  const activeProgress = (count / (activePlain || nextPlain).symbols) * 100;
  const nextProgress = nextPlain ? (count / nextPlain.symbols) * 100 : 100;

  return (
    <Container>
      <Segment textAlign="center" raised>
        <Progress
          percent={activeProgress}
          attached="top"
          color="blue"
          autoSuccess
        />
        <Progress
          percent={nextProgress}
          attached="bottom"
          color="blue"
          autoSuccess
        />

        {activePlain && (
          <>
            <Header as="h1" className="instructions">
              You can generate {activePlain.symbols} cards with{' '}
              {activePlain.symbolsPerCard} images per card.
              {count > activePlain.symbols && (
                <Header.Subheader>
                  You have uploaded too much images. Last{' '}
                  {count - activePlain.symbols} images will not be used.
                </Header.Subheader>
              )}
            </Header>
            <Button
              size="massive"
              positive
              disabled={processing}
              onClick={() => generatePdf(activePlain.n)}
            >
              <Icon loading={processing} name="file pdf outline" />
              Generate and download PDF file
            </Button>
          </>
        )}

        {activePlain && nextPlain && (
          <Divider horizontal className="padded">
            Or
          </Divider>
        )}

        {nextPlain && (
          <Header as="h3" className="instructions">
            Add {nextPlain.symbols - count} more images to generate{' '}
            {nextPlain.symbols} cards with {nextPlain.symbolsPerCard} images per
            card
          </Header>
        )}
      </Segment>
    </Container>
  );
};

export default connect(
  (state: State) => ({
    images: state.images,
    plains,
    processing: state.processing,
  }),
  { generatePdf },
)(Summary);
