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
import { NodeType, SourceNodeData, LayerNodeData } from '../types/flow';
import { STORAGE_KEY } from '../constants/flow';
import { isValidUrl } from '../utils/validation';

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
               if (sourceNode?.type === 'source') {
                    const sourceData = sourceNode.data as unknown as SourceNodeData;
                    if (!isValidUrl(sourceData.url)) {
                         console.warn('Cannot connect source node with invalid URL');
                         return;
                    }
               }
               setEdges(eds => addEdge(params, eds));
               saveToLocalStorage();
          },
          [nodes, saveToLocalStorage]
     );

     const updateNodeData = useCallback(
          (nodeId: string, data: Partial<SourceNodeData | LayerNodeData>) => {
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
          },
          []
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
