import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { GeospatialViewer } from '../GeospatialViewer';
import type { Edge } from '@xyflow/react';

// Mock DeckGL
vi.mock('@deck.gl/react', () => ({
     DeckGL: vi.fn(({ layers }) => (
          <div data-testid="deck-gl">
               {layers.map((layer: { props: unknown }, i: number) => (
                    <div
                         key={i}
                         data-testid="geojson-layer"
                         data-layer={JSON.stringify(layer.props)}
                    />
               ))}
          </div>
     )),
}));

describe('GeospatialViewer', () => {
     const mockNodes = [
          {
               id: 'node-1',
               type: 'layer',
               data: {
                    geometry: {
                         type: 'FeatureCollection',
                         features: [
                              {
                                   type: 'Feature',
                                   geometry: {
                                        type: 'Polygon',
                                        coordinates: [
                                             [
                                                  [0, 0],
                                                  [1, 0],
                                                  [1, 1],
                                                  [0, 1],
                                                  [0, 0],
                                             ],
                                        ],
                                   },
                                   properties: { name: 'Test Polygon' },
                              },
                         ],
                    },
               },
               position: { x: 0, y: 0 },
          },
     ];

     const mockEdges: Edge[] = [];

     it('renders DeckGL component', () => {
          const { getByTestId } = render(<GeospatialViewer nodes={mockNodes} edges={mockEdges} />);
          expect(getByTestId('deck-gl')).toBeInTheDocument();
     });

     it('handles nodes without geometry', () => {
          const nodesWithoutGeometry = [
               {
                    ...mockNodes[0],
                    data: {},
               },
          ];

          const { queryByTestId } = render(
               <GeospatialViewer nodes={nodesWithoutGeometry} edges={mockEdges} />
          );
          expect(queryByTestId('geojson-layer')).not.toBeInTheDocument();
     });

     it('orders layers by node position', () => {
          const multipleNodes = [
               {
                    ...mockNodes[0],
                    position: { x: 0, y: 100 },
               },
               {
                    ...mockNodes[0],
                    id: 'node-2',
                    position: { x: 0, y: 0 },
               },
          ];

          const { getAllByTestId } = render(
               <GeospatialViewer nodes={multipleNodes} edges={mockEdges} />
          );
          const layers = getAllByTestId('geojson-layer');
          expect(layers).toHaveLength(2);

          // Check that layers are ordered by Y position (lower Y = higher in stack)
          const layerProps = layers.map(layer => JSON.parse(layer.dataset.layer || '{}'));
          expect(layerProps[0].id).toBe('geojson-layer-node-2');
          expect(layerProps[1].id).toBe('geojson-layer-node-1');
     });
});
