/**
 * Provides functionality for processing geospatial data in the flow diagram.
 * This hook contains the core logic for handling GeoJSON data and geometric operations.
 *
 * Features:
 * - GeoJSON feature intersection using Turf.js
 * - Flow processing to update layer nodes with geometry data
 * - Support for both single features and feature collections
 * - Error handling for invalid geometries
 */

import { Node, Edge } from '@xyflow/react';
import { Feature, Polygon, MultiPolygon, FeatureCollection } from 'geojson';
import intersect from '@turf/intersect';
import { featureCollection } from '@turf/helpers';

/**
 * Performs a geometric intersection between two GeoJSON features.
 * Uses Turf.js for the intersection calculation.
 *
 * @param {Feature<Polygon | MultiPolygon>} feature1 - First feature to intersect
 * @param {Feature<Polygon | MultiPolygon>} feature2 - Second feature to intersect
 * @returns {Feature<Polygon | MultiPolygon> | null} The intersection result or null if no intersection
 */
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

/**
 * Hook for processing geospatial data in the flow diagram.
 * 
 * @returns {Object} Processing functions
 * @returns {Function} processFlow - Updates nodes with processed geometry data
 */
export const useGeospatialProcessing = () => {
     /**
      * Processes the flow diagram to update layer nodes with geometry data.
      * Handles both direct source connections and intersection nodes.
      *
      * @param {Node[]} currentNodes - Current nodes in the flow
      * @param {Edge[]} currentEdges - Current edges in the flow
      * @returns {Node[]} Updated nodes with processed geometry data
      */
     const processFlow = (currentNodes: Node[], currentEdges: Edge[]) => {
          // For each layer node, find its incoming connections
          const updatedNodes = currentNodes.map(node => {
               if (node.type === 'layer') {
                    const incomingEdges = currentEdges.filter(edge => edge.target === node.id);

                    // Find the source node for this layer
                    const sourceEdge = incomingEdges[0];
                    if (sourceEdge) {
                         const sourceNode = currentNodes.find(
                              node => node.id === sourceEdge.source
                         );

                         if (sourceNode) {
                              if (sourceNode.type === 'source' && sourceNode.data?.geojson) {
                                   return {
                                        ...node,
                                        data: {
                                             ...node.data,
                                             geometry: sourceNode.data.geojson,
                                        },
                                   };
                              } else if (sourceNode.type === 'intersection') {
                                   // Get the incoming edges to the intersection node
                                   const intersectionIncomingEdges = currentEdges.filter(
                                        edge => edge.target === sourceNode.id
                                   );

                                   if (intersectionIncomingEdges.length === 2) {
                                        const sourceNodes = intersectionIncomingEdges
                                             .map(edge =>
                                                  currentNodes.find(node => node.id === edge.source)
                                             )
                                             .filter(Boolean);

                                        if (
                                             sourceNodes.length === 2 &&
                                             sourceNodes[0]?.data?.geojson &&
                                             sourceNodes[1]?.data?.geojson
                                        ) {
                                             const geojson1 = sourceNodes[0].data.geojson as
                                                  | Feature<Polygon | MultiPolygon>
                                                  | FeatureCollection<Polygon | MultiPolygon>;
                                             const geojson2 = sourceNodes[1].data.geojson as
                                                  | Feature<Polygon | MultiPolygon>
                                                  | FeatureCollection<Polygon | MultiPolygon>;

                                             const features1 =
                                                  'features' in geojson1
                                                       ? geojson1.features
                                                       : [geojson1];
                                             const features2 =
                                                  'features' in geojson2
                                                       ? geojson2.features
                                                       : [geojson2];

                                             // Get the first polygon feature from each source
                                             const geom1 = features1.find(
                                                  (f: Feature<Polygon | MultiPolygon>) =>
                                                       f.geometry.type === 'Polygon' ||
                                                       f.geometry.type === 'MultiPolygon'
                                             );
                                             const geom2 = features2.find(
                                                  (f: Feature<Polygon | MultiPolygon>) =>
                                                       f.geometry.type === 'Polygon' ||
                                                       f.geometry.type === 'MultiPolygon'
                                             );

                                             if (!geom1 || !geom2) {
                                                  console.error(
                                                       'No valid polygon features found for intersection'
                                                  );
                                                  return node;
                                             }

                                             // Perform intersection
                                             const intersection = performIntersection(geom1, geom2);

                                             if (intersection) {
                                                  return {
                                                       ...node,
                                                       data: {
                                                            ...node.data,
                                                            geometry: intersection,
                                                       },
                                                  };
                                             }
                                        }
                                   }
                              }
                         }
                    }
               }
               return node;
          });

          return updatedNodes;
     };

     return { processFlow };
};
