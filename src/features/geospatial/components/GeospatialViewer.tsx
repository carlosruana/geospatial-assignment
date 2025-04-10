import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Node, Edge } from '@xyflow/react';
import { useFlow } from '../../../features/flow/hooks/useFlow';
import {
     Feature,
     Polygon,
     MultiPolygon,
     Point,
     FeatureCollection,
     GeoJsonProperties,
} from 'geojson';
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
               .map(
                    node =>
                         node.data.geometry as
                              | Feature<Polygon | MultiPolygon | Point>
                              | FeatureCollection<Polygon | MultiPolygon | Point>
               );

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
               if (!feature) return;

               if (feature.type === 'FeatureCollection') {
                    feature.features.forEach(f => {
                         if (!f.geometry) return;
                         if (f.geometry.type === 'Point') {
                              const [lng, lat] = f.geometry.coordinates;
                              minLng = Math.min(minLng, lng);
                              minLat = Math.min(minLat, lat);
                              maxLng = Math.max(maxLng, lng);
                              maxLat = Math.max(maxLat, lat);
                         } else if (f.geometry.type === 'Polygon') {
                              f.geometry.coordinates[0].forEach(coord => {
                                   const [lng, lat] = coord;
                                   minLng = Math.min(minLng, lng);
                                   minLat = Math.min(minLat, lat);
                                   maxLng = Math.max(maxLng, lng);
                                   maxLat = Math.max(maxLat, lat);
                              });
                         } else if (f.geometry.type === 'MultiPolygon') {
                              f.geometry.coordinates.forEach(polygon => {
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
               } else if (feature.type === 'Feature' && feature.geometry) {
                    if (feature.geometry.type === 'Point') {
                         const [lng, lat] = feature.geometry.coordinates;
                         minLng = Math.min(minLng, lng);
                         minLat = Math.min(minLat, lat);
                         maxLng = Math.max(maxLng, lng);
                         maxLat = Math.max(maxLat, lat);
                    } else if (feature.geometry.type === 'Polygon') {
                         feature.geometry.coordinates[0].forEach(coord => {
                              const [lng, lat] = coord;
                              minLng = Math.min(minLng, lng);
                              minLat = Math.min(minLat, lat);
                              maxLng = Math.max(maxLng, lng);
                              maxLat = Math.max(maxLat, lat);
                         });
                    } else if (feature.geometry.type === 'MultiPolygon') {
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
               const typedGeometry = geometry as
                    | Feature<Point | Polygon | MultiPolygon>
                    | FeatureCollection<Point | Polygon | MultiPolygon>;
               const features =
                    typedGeometry.type === 'FeatureCollection'
                         ? typedGeometry.features
                         : [typedGeometry];

               return new GeoJsonLayer({
                    id: `geojson-layer-${node.id}`,
                    data: features,
                    pickable: true,
                    stroked: true,
                    filled: true,
                    extruded: false,
                    pointType: 'circle',
                    pointRadiusUnits: 'pixels',
                    getPointRadius: feature => {
                         if (feature.geometry.type === 'Point') {
                              return 5; // Smaller radius for points
                         }
                         return 0; // No radius for polygons
                    },
                    getFillColor: feature => {
                         if (feature.geometry.type === 'Point') {
                              return [0, 0, 255, 200]; // Blue for points
                         }
                         return [230, 230, 230, 255]; // Red for polygons, opaque opacity
                    },
                    getLineColor: [255, 0, 0],
                    getLineWidth: 2,
                    zIndex: index,
               });
          });

     const renderTooltip = (info: {
          object?: Feature<Point | Polygon | MultiPolygon, GeoJsonProperties>;
     }) => {
          if (!info?.object || info.object.geometry.type !== 'Point') return null;

          const properties = info.object.properties || {};
          const name = properties.name || Object.values(properties)[0] || 'Unnamed point';

          return {
               html: `<div>${name}</div>`,
               style: {
                    backgroundColor: '#fff',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    border: '1px solid #e0e0e0',
                    fontSize: '13px',
                    color: '#333',
                    maxWidth: '500px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
               },
          };
     };

     return (
          <div style={{ width: '100%', height: '100%' }}>
               <DeckGL
                    initialViewState={initialViewState}
                    controller={true}
                    layers={layers}
                    getTooltip={renderTooltip}
               />
          </div>
     );
};
