import { useCallback } from 'react';
import { addEdge, Connection, useReactFlow, Node, Edge } from '@xyflow/react';
import { NodeType } from '../types/flow';
import intersect from '@turf/intersect';
import { featureCollection } from '@turf/helpers';
import { Polygon, MultiPolygon, Feature } from 'geojson';

export const useFlow = () => {
     const { setNodes, setEdges } = useReactFlow();

     const addNode = useCallback(
          (type: NodeType, position: { x: number; y: number }) => {
               const newNode = {
                    id: `${type}-${Date.now()}`,
                    type,
                    position,
                    data: type === 'source' ? { url: '' } : { layerId: Date.now() },
               };

               setNodes(nds => [...nds, newNode]);
          },
          [setNodes]
     );

     const onConnect = useCallback(
          (params: Connection) => {
               setEdges(eds => addEdge(params, eds));
          },
          [setEdges]
     );

     const processFlow = (currentNodes: Node[], currentEdges: Edge[]) => {
          console.log('Processing flow with nodes:', currentNodes);
          console.log('Processing flow with edges:', currentEdges);

          // Find all layer nodes
          const layerNodes = currentNodes.filter(node => node.type === 'layer');
          console.log('Found layer nodes:', layerNodes);

          // For each layer node, find its incoming connections
          const updatedNodes = currentNodes.map(node => {
               if (node.type === 'layer') {
                    const incomingEdges = currentEdges.filter(edge => edge.target === node.id);
                    console.log(`Incoming edges for layer node ${node.id}:`, incomingEdges);

                    // Find the source node for this layer
                    const sourceEdge = incomingEdges[0];
                    if (sourceEdge) {
                         const sourceNode = currentNodes.find(
                              node => node.id === sourceEdge.source
                         );
                         console.log(`Found source node for layer ${node.id}:`, sourceNode);

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
                                             const geom1 = sourceNodes[0].data.geojson as Feature<
                                                  Polygon | MultiPolygon
                                             >;
                                             const geom2 = sourceNodes[1].data.geojson as Feature<
                                                  Polygon | MultiPolygon
                                             >;

                                             const intersection = intersect(
                                                  featureCollection([geom1, geom2])
                                             );
                                             console.log('Intersection result:', intersection);

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

     return {
          addNode,
          onConnect,
          processFlow,
     };
};
