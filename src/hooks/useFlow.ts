import { useState, useCallback, useEffect } from 'react';
import {
     NodeChange,
     EdgeChange,
     applyNodeChanges,
     applyEdgeChanges,
     addEdge,
     Connection,
     Node,
     Edge,
} from '@xyflow/react';
import { NodeType, LayerNodeData } from '../types/flow';
import { STORAGE_KEY } from '../constants/flow';
import { isValidUrl } from '../utils/validation';
import { performIntersection } from '../utils/geospatial';
import { Feature, Polygon, MultiPolygon } from 'geojson';

const isLocalStorageAvailable = () => {
     try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
     } catch {
          return false;
     }
};

const loadInitialState = () => {
     if (!isLocalStorageAvailable()) {
          return { nodes: [], edges: [] };
     }
     try {
          const savedState = localStorage.getItem(STORAGE_KEY);
          if (savedState) {
               return JSON.parse(savedState);
          }
     } catch (error) {
          console.error('Error loading from localStorage:', error);
     }
     return { nodes: [], edges: [] };
};

export const useFlow = () => {
     const initialState = loadInitialState();
     const [nodes, setNodes] = useState<Node[]>(initialState.nodes);
     const [edges, setEdges] = useState<Edge[]>(initialState.edges);

     // Save to localStorage whenever nodes or edges change
     useEffect(() => {
          if (isLocalStorageAvailable()) {
               try {
                    const flowState = { nodes, edges };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState));
               } catch (error) {
                    console.error('Error saving to localStorage:', error);
               }
          }
     }, [nodes, edges]);

     const onNodesChange = useCallback((changes: NodeChange[]) => {
          setNodes(nds => applyNodeChanges(changes, nds));
     }, []);

     const onEdgesChange = useCallback((changes: EdgeChange[]) => {
          setEdges(eds => applyEdgeChanges(changes, eds));
     }, []);

     const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
          const newNode: Node = {
               id: `${type}-${Date.now()}`,
               type,
               position,
               data: type === 'source' ? { url: '' } : { layerId: Date.now() },
          };

          setNodes(nds => [...nds, newNode]);
     }, []);

     const onConnect = useCallback(
          (params: Connection) => {
               const sourceNode = nodes.find(node => node.id === params.source);
               const targetNode = nodes.find(node => node.id === params.target);

               if (sourceNode?.type === 'source') {
                    const sourceData = sourceNode.data as {
                         url: string;
                         geojson?: Feature<Polygon | MultiPolygon>;
                    };
                    if (!isValidUrl(sourceData.url)) {
                         console.warn('Cannot connect source node with invalid URL');
                         return;
                    }
                    if (!sourceData.geojson) {
                         console.warn('Source node has no GeoJSON data');
                         return;
                    }
                    if (targetNode?.type === 'layer') {
                         setNodes(nds =>
                              nds.map(node => {
                                   if (node.id === targetNode.id) {
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
                              const firstLayerData =
                                   firstSourceNode.data as unknown as LayerNodeData;
                              const secondLayerData = sourceNode.data as unknown as LayerNodeData;

                              // Perform the intersection
                              const result = performIntersection(
                                   firstLayerData.geometry,
                                   secondLayerData.geometry
                              );

                              if (result) {
                                   // Create a new layer node with the result
                                   const newLayerNode: Node = {
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
                    setEdges(eds => addEdge(params, eds));
               }
          },
          [nodes, edges]
     );

     const updateNodeData = useCallback((nodeId: string, data: Record<string, unknown>) => {
          setNodes(nds =>
               nds.map(node => {
                    if (node.id === nodeId) {
                         return {
                              ...node,
                              data: {
                                   ...node.data,
                                   ...data,
                              },
                         };
                    }
                    return node;
               })
          );
     }, []);

     return {
          nodes,
          edges,
          onNodesChange,
          onEdgesChange,
          addNode,
          onConnect,
          updateNodeData,
     };
};
