/**
 * GeoJSON data fetching and processing service.
 * Handles fetching GeoJSON data from URLs and converting various data formats
 * into standardized GeoJSON FeatureCollections.
 *
 * Supported input formats:
 * 1. Standard GeoJSON FeatureCollection
 * 2. Single GeoJSON Feature
 * 3. Custom format with contour arrays
 * 4. Array of custom features
 *
 * @module geospatialService
 */

import { Feature, Polygon, MultiPolygon, Point, FeatureCollection } from 'geojson';

/**
 * Fetches and processes GeoJSON data from a URL.
 * Handles various input formats and converts them to a standardized FeatureCollection.
 *
 * @async
 * @param {string} url - The URL to fetch GeoJSON data from
 * @returns {Promise<FeatureCollection<Polygon | MultiPolygon | Point>>} Standardized GeoJSON FeatureCollection
 * @throws {Error} If the data is invalid or cannot be processed
 */
export const fetchGeoJSON = async (
     url: string
): Promise<FeatureCollection<Polygon | MultiPolygon | Point>> => {
     const response = await fetch(url);
     const data = await response.json();

     // Handle standard GeoJSON FeatureCollection
     if (data.type === 'FeatureCollection') {
          if (!Array.isArray(data.features) || data.features.length === 0) {
               throw new Error('Invalid GeoJSON: FeatureCollection has no features');
          }

          // Return the entire FeatureCollection
          return data;
     }

     // Handle standard GeoJSON Feature
     if (data.type === 'Feature') {
          if (
               !data.geometry ||
               (data.geometry.type !== 'Polygon' &&
                    data.geometry.type !== 'MultiPolygon' &&
                    data.geometry.type !== 'Point')
          ) {
               throw new Error('Invalid GeoJSON: Feature is not a Polygon, MultiPolygon, or Point');
          }
          return {
               type: 'FeatureCollection',
               features: [data],
          };
     }

     // Handle custom format (array of features)
     if (Array.isArray(data)) {
          // Convert each item to a GeoJSON Feature
          const features = data.map(item => {
               if (!item.contour || !Array.isArray(item.contour)) {
                    throw new Error('Invalid data format: missing or invalid contour property');
               }

               // Create a GeoJSON Feature
               // Keep all original properties from the item except 'contour'
               const { contour, ...properties } = item;
               const feature: Feature<Polygon> = {
                    type: 'Feature',
                    properties,
                    geometry: {
                         type: 'Polygon',
                         coordinates: [contour], // Wrap the contour in an array to make it a polygon
                    },
               };
               return feature;
          });

          if (features.length === 0) {
               throw new Error('No features found in data');
          }

          return {
               type: 'FeatureCollection',
               features,
          };
     }

     // Handle single custom feature
     if (data.contour && Array.isArray(data.contour)) {
          // Keep all original properties from the data except 'contour'
          const { contour, ...properties } = data;
          const feature: Feature<Polygon> = {
               type: 'Feature',
               properties,
               geometry: {
                    type: 'Polygon',
                    coordinates: [contour],
               },
          };
          return {
               type: 'FeatureCollection',
               features: [feature],
          };
     }

     throw new Error(
          'Invalid data format: must be a GeoJSON Feature, FeatureCollection, or contain contour property with coordinates'
     );
};
