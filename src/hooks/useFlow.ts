import { useState, useCallback } from 'react';
import {
     NodeChange,
     EdgeChange,
     applyNodeChanges,
     applyEdgeChanges,
     addEdge,
     Connection,
} from '@xyflow/react';
import { CustomNode, CustomEdge, NodeType } from '../types/flow';
import { STORAGE_KEY } from '../constants/flow';

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
     const [nodes, setNodes] = useState<CustomNode[]>([]);
     const [edges, setEdges] = useState<CustomEdge[]>([]);

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
          setNodes(nds => applyNodeChanges(changes, nds) as CustomNode[]);
     }, []);

     const onEdgesChange = useCallback((changes: EdgeChange[]) => {
          setEdges(eds => applyEdgeChanges(changes, eds) as CustomEdge[]);
     }, []);

     const addNode = useCallback(
          (type: NodeType, position: { x: number; y: number }) => {
               const newNode: CustomNode = {
                    id: `${type}-${Date.now()}`,
                    type,
                    position,
                    data: type === 'source' ? { url: '' } : { layerId: `layer-${Date.now()}` },
               };
               setNodes(nds => [...nds, newNode]);
               saveToLocalStorage();
          },
          [saveToLocalStorage]
     );

     const onConnect = useCallback(
          (params: Connection) => {
               setEdges(eds => addEdge(params, eds));
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
     };
};
