import { useCallback } from 'react';
import {
     NodeChange,
     EdgeChange,
     applyNodeChanges,
     applyEdgeChanges,
     addEdge,
     Connection,
     useReactFlow,
} from '@xyflow/react';
import { NodeType } from '../types/flow';
import { performIntersection } from '../utils/geospatial';
import { Feature, Polygon, MultiPolygon } from 'geojson';

export const useFlow = () => {
     const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

     const onNodesChange = useCallback(
          (changes: NodeChange[]) => {
               setNodes(nds => applyNodeChanges(changes, nds));
               console.log('Nodes changed:', changes);
          },
          [setNodes]
     );

     const onEdgesChange = useCallback(
          (changes: EdgeChange[]) => {
               setEdges(eds => {
                    const newEdges = applyEdgeChanges(changes, eds);

                    // Handle edge removal
                    changes.forEach(change => {
                         if (change.type === 'remove') {
                              const removedEdge = eds.find(edge => edge.id === change.id);
                              if (removedEdge) {
                                   // Clear geometry from target node
                                   setNodes(nds =>
                                        nds.map(node => {
                                             if (node.id === removedEdge.target) {
                                                  return {
                                                       ...node,
                                                       data: {
                                                            ...node.data,
                                                            geometry: undefined,
                                                       },
                                                  };
                                             }
                                             return node;
                                        })
                                   );
                              }
                         }
                    });

                    return newEdges;
               });
          },
          [setEdges, setNodes]
     );

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
               const nodes = getNodes();
               const edges = getEdges();
               const sourceNode = nodes.find(node => node.id === params.source);
               const targetNode = nodes.find(node => node.id === params.target);

               // Check if target is an intersection node
               if (targetNode?.type === 'intersection') {
                    // Get all incoming edges to the intersection node
                    const incomingEdges = edges.filter(edge => edge.target === targetNode.id);

                    // If this is the first connection, allow it
                    if (incomingEdges.length === 0) {
                         setEdges(eds => addEdge(params, eds));
                         return;
                    }

                    // If this is the second connection, perform the intersection
                    if (incomingEdges.length === 1) {
                         const firstSourceNode = nodes.find(
                              node => node.id === incomingEdges[0].source
                         );

                         if (firstSourceNode?.type === 'layer' && sourceNode?.type === 'layer') {
                              const firstLayerData = firstSourceNode.data as unknown as {
                                   geometry: Feature<Polygon | MultiPolygon>;
                              };
                              const secondLayerData = sourceNode.data as unknown as {
                                   geometry: Feature<Polygon | MultiPolygon>;
                              };

                              // Perform the intersection
                              const result = performIntersection(
                                   firstLayerData.geometry,
                                   secondLayerData.geometry
                              );

                              if (result) {
                                   // Create a new layer node with the result
                                   const newLayerNode = {
                                        id: `layer-${Date.now()}`,
                                        type: 'layer',
                                        position: {
                                             x: targetNode.position.x + 200,
                                             y: targetNode.position.y,
                                        },
                                        data: {
                                             layerId: Date.now(),
                                             geometry: result,
                                        },
                                   };

                                   setNodes(nds => [...nds, newLayerNode]);
                                   setEdges(eds => addEdge(params, eds));
                              } else {
                                   console.warn('Intersection operation failed');
                              }
                         }
                    } else {
                         console.warn('Intersection node can only have two inputs');
                    }
               } else {
                    // For regular connections, update target node geometry if source has GeoJSON
                    if (sourceNode?.type === 'source') {
                         const sourceData = sourceNode.data as unknown as {
                              url: string;
                              geojson?: Feature<Polygon | MultiPolygon>;
                         };
                         if (sourceData.geojson) {
                              setNodes(nds =>
                                   nds.map(node => {
                                        if (node.id === params.target) {
                                             return {
                                                  ...node,
                                                  data: {
                                                       ...node.data,
                                                       geometry: sourceData.geojson,
                                                  },
                                             };
                                        }
                                        return node;
                                   })
                              );
                         }
                    }
                    setEdges(eds => addEdge(params, eds));
               }
          },
          [getNodes, getEdges, setNodes, setEdges]
     );

     return {
          nodes: getNodes(),
          edges: getEdges(),
          onNodesChange,
          onEdgesChange,
          addNode,
          onConnect,
     };
};
