import { useCallback } from 'react';
import { addEdge, Connection, useReactFlow } from '@xyflow/react';
import { NodeType } from '../types/flow';

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


     return {
          addNode,
          onConnect,
     };
};
