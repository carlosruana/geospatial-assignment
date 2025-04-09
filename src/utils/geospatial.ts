import intersect from '@turf/intersect';
import { featureCollection } from '@turf/helpers';
import { Feature, Polygon, MultiPolygon } from 'geojson';

export const performIntersection = (
     feature1: Feature<Polygon | MultiPolygon>,
     feature2: Feature<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null => {
     try {
          const collection = featureCollection([feature1, feature2]);
          const result = intersect(collection);
          return result;
     } catch (error) {
          console.error('Error performing intersection:', error);
          return null;
     }
};

export const fetchGeoJSON = async (url: string): Promise<Feature<Polygon | MultiPolygon>> => {
     console.log('Fetching GeoJSON from URL:', url);
     const response = await fetch(url);
     const data = await response.json();
     console.log('Received data:', JSON.stringify(data, null, 2));

     // Handle standard GeoJSON FeatureCollection
     if (data.type === 'FeatureCollection') {
          console.log('Processing FeatureCollection');
          if (!Array.isArray(data.features) || data.features.length === 0) {
               throw new Error('Invalid GeoJSON: FeatureCollection has no features');
          }

          // Find the first feature that matches our requirements
          const feature = data.features.find(
               (f: Feature) =>
                    f.type === 'Feature' &&
                    f.geometry &&
                    (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
          );

          if (!feature) {
               throw new Error('Invalid GeoJSON: No Polygon or MultiPolygon features found');
          }

          console.log('Found suitable feature:', feature);
          return feature as Feature<Polygon | MultiPolygon>;
     }

     // Handle standard GeoJSON Feature
     if (data.type === 'Feature') {
          console.log('Processing Feature');
          if (
               !data.geometry ||
               (data.geometry.type !== 'Polygon' && data.geometry.type !== 'MultiPolygon')
          ) {
               throw new Error('Invalid GeoJSON: Feature is not a Polygon or MultiPolygon');
          }
          return data as Feature<Polygon | MultiPolygon>;
     }

     // Handle custom format (array of features)
     if (Array.isArray(data)) {
          console.log('Processing array of features');
          // Convert each item to a GeoJSON Feature
          const features = data.map(item => {
               if (!item.contour || !Array.isArray(item.contour)) {
                    throw new Error('Invalid data format: missing or invalid contour property');
               }

               // Create a GeoJSON Feature
               const feature: Feature<Polygon> = {
                    type: 'Feature',
                    properties: {
                         zipcode: item.zipcode,
                         population: item.population,
                         area: item.area,
                    },
                    geometry: {
                         type: 'Polygon',
                         coordinates: [item.contour], // Wrap the contour in an array to make it a polygon
                    },
               };
               return feature;
          });

          // Return the first feature
          if (features.length === 0) {
               throw new Error('No features found in data');
          }

          console.log('Converted to GeoJSON Feature:', features[0]);
          return features[0];
     }

     // Handle single custom feature
     if (data.contour && Array.isArray(data.contour)) {
          console.log('Processing single custom feature');
          const feature: Feature<Polygon> = {
               type: 'Feature',
               properties: {
                    zipcode: data.zipcode,
                    population: data.population,
                    area: data.area,
               },
               geometry: {
                    type: 'Polygon',
                    coordinates: [data.contour],
               },
          };
          console.log('Converted to GeoJSON Feature:', feature);
          return feature;
     }

     throw new Error(
          'Invalid data format: must be a GeoJSON Feature, FeatureCollection, or contain contour property with coordinates'
     );
};
