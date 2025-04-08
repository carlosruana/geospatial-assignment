import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Feature, Polygon, MultiPolygon } from 'geojson';
import { Box } from '@mui/material';

interface GeospatialViewerProps {
     features: Feature<Polygon | MultiPolygon>[];
}

const INITIAL_VIEW_STATE = {
     longitude: -122.41669,
     latitude: 37.7853,
     zoom: 13,
     pitch: 0,
     bearing: 0,
};

export const GeospatialViewer = ({ features }: GeospatialViewerProps) => {
     const layers = [
          new GeoJsonLayer({
               id: 'geojson-layer',
               data: features,
               pickable: true,
               stroked: true,
               filled: true,
               extruded: false,
               lineWidthMinPixels: 2,
               getFillColor: [255, 0, 0, 128],
               getLineColor: [0, 0, 0],
               getLineWidth: 1,
          }),
     ];

     return (
          <Box sx={{ width: '100%', height: '100%' }}>
               <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers} />
          </Box>
     );
};
