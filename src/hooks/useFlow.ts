import { useState, useCallback } from 'react';
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
import { NodeType, SourceNodeData, LayerNodeData, IntersectionNodeData } from '../types/flow';
import { STORAGE_KEY } from '../constants/flow';
import { isValidUrl } from '../utils/validation';
import { performIntersection } from '../utils/geospatial';

const isLocalStorageAvailable = () => {
     try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
     } catch {
          return false;
     }
};

export const useFlow = () => {
     const [nodes, setNodes] = useState<Node[]>([]);
     const [edges, setEdges] = useState<Edge[]>([]);

     const saveToLocalStorage = useCallback(() => {
          if (!isLocalStorageAvailable()) {
               console.warn('localStorage is not available');
               return;
          }
          try {
               const flowState = { nodes, edges };
               localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState));
          } catch (error) {
               console.error('Error saving to localStorage:', error);
          }
     }, [nodes, edges]);

     const loadFromLocalStorage = useCallback(() => {
          if (!isLocalStorageAvailable()) {
               console.warn('localStorage is not available');
               return;
          }
          try {
               const savedState = localStorage.getItem(STORAGE_KEY);
               if (savedState) {
                    const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedState);
                    setNodes(savedNodes);
                    setEdges(savedEdges);
               }
          } catch (error) {
               console.error('Error loading from localStorage:', error);
          }
     }, []);

     const onNodesChange = useCallback((changes: NodeChange[]) => {
          setNodes(nds => applyNodeChanges(changes, nds));
     }, []);

     const onEdgesChange = useCallback((changes: EdgeChange[]) => {
          setEdges(eds => applyEdgeChanges(changes, eds));
     }, []);

     const addNode = useCallback(
          (type: NodeType, position: { x: number; y: number }) => {
               const newNode: Node = {
                    id: `${type}-${Date.now()}`,
                    type,
                    position,
                    data: type === 'source' ? { url: '' } : { layerId: Date.now() },
               };

               setNodes(nds => [...nds, newNode]);
               saveToLocalStorage();
          },
          [saveToLocalStorage]
     );

     const onConnect = useCallback(
          (params: Connection) => {
               const sourceNode = nodes.find(node => node.id === params.source);
               const targetNode = nodes.find(node => node.id === params.target);

               if (sourceNode?.type === 'source') {
                    const sourceData = sourceNode.data as unknown as SourceNodeData;
                    if (!isValidUrl(sourceData.url)) {
                         console.warn('Cannot connect source node with invalid URL');
                         return;
                    }
               }

               // Check if target is an intersection node
               if (targetNode?.type === 'intersection') {
                    // Get all incoming edges to the intersection node
                    const incomingEdges = edges.filter(edge => edge.target === targetNode.id);

                    // If this is the first connection, allow it
                    if (incomingEdges.length === 0) {
                         setEdges(eds => addEdge(params, eds));
                         saveToLocalStorage();
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
                                   saveToLocalStorage();
                              } else {
                                   console.warn('Intersection operation failed');
                              }
                         }
                    } else {
                         console.warn('Intersection node can only have two inputs');
                    }
               } else {
                    setEdges(eds => addEdge(params, eds));
                    saveToLocalStorage();
               }
          },
          [nodes, edges, saveToLocalStorage]
     );

     const updateNodeData = useCallback(
          (
               nodeId: string,
               data: Partial<SourceNodeData | LayerNodeData | IntersectionNodeData>
          ) => {
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
               saveToLocalStorage();
          },
          [saveToLocalStorage]
     );

     return {
          nodes,
          edges,
          onNodesChange,
          onEdgesChange,
          saveToLocalStorage,
          loadFromLocalStorage,
          addNode,
          onConnect,
          updateNodeData,
     };
};
