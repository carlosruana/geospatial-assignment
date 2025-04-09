import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Node, Edge } from '@xyflow/react';
import { useFlow } from '../../../features/flow/hooks/useFlow';
import { Feature, Polygon, MultiPolygon, Point } from 'geojson';
import { useMemo } from 'react';

interface GeospatialViewerProps {
     nodes: Node[];
     edges: Edge[];
}

export const GeospatialViewer = ({ nodes, edges }: GeospatialViewerProps) => {
     const { processFlow } = useFlow();

     // Process the flow with the provided nodes and edges
     const processedNodes = processFlow(nodes, edges);

     // Sort nodes by vertical position to determine z-index
     const sortedNodes = [...processedNodes].sort((a, b) => a.position.y - b.position.y);

     // Calculate the initial view state based on all geometries
     const initialViewState = useMemo(() => {
          const features = sortedNodes
               .filter(node => node.type === 'layer' && node.data?.geometry)
               .map(node => node.data.geometry as Feature<Polygon | MultiPolygon>);

          if (features.length === 0) {
               return {
                    longitude: -122.123801,
                    latitude: 37.893394,
                    zoom: 15,
                    pitch: 0,
                    bearing: 0,
               };
          }

          // Calculate bounding box
          let minLng = Infinity;
          let minLat = Infinity;
          let maxLng = -Infinity;
          let maxLat = -Infinity;

          features.forEach(feature => {
               if (feature.geometry.type === 'Polygon') {
                    // Handle Polygon
                    feature.geometry.coordinates[0].forEach(coord => {
                         const [lng, lat] = coord;
                         minLng = Math.min(minLng, lng);
                         minLat = Math.min(minLat, lat);
                         maxLng = Math.max(maxLng, lng);
                         maxLat = Math.max(maxLat, lat);
                    });
               } else if (feature.geometry.type === 'MultiPolygon') {
                    // Handle MultiPolygon
                    feature.geometry.coordinates.forEach(polygon => {
                         polygon[0].forEach(coord => {
                              const [lng, lat] = coord;
                              minLng = Math.min(minLng, lng);
                              minLat = Math.min(minLat, lat);
                              maxLng = Math.max(maxLng, lng);
                              maxLat = Math.max(maxLat, lat);
                         });
                    });
               }
          });

          // Calculate center and zoom level
          const centerLng = (minLng + maxLng) / 2;
          const centerLat = (minLat + maxLat) / 2;
          const zoom = Math.min(15, Math.log2(360 / (maxLng - minLng)) - 1);

          return {
               longitude: centerLng,
               latitude: centerLat,
               zoom,
               pitch: 0,
               bearing: 0,
          };
     }, [sortedNodes]);

     const layers = sortedNodes
          .filter(node => {
               const geometry = node.data?.geometry || node.data?.geojson;
               return node.type === 'layer' && geometry;
          })
          .map((node, index) => {
               const geometry = node.data?.geometry || node.data?.geojson;
               return new GeoJsonLayer({
                    id: `geojson-layer-${node.id}`,
                    data: geometry as Feature<Point | Polygon | MultiPolygon>,
                    pickable: true,
                    stroked: true,
                    filled: true,
                    extruded: false,
                    pointType: 'circle',
                    getPointRadius: 100,
                    getFillColor: [255, 0, 0, 128],
                    getLineColor: [255, 0, 0],
                    getLineWidth: 2,
                    zIndex: index,
               });
          });

     return (
          <div style={{ width: '100%', height: '100%' }}>
               <DeckGL initialViewState={initialViewState} controller={true} layers={layers} />
          </div>
     );
};
