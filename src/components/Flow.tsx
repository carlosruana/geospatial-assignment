import { useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, NodeTypes } from '@xyflow/react';
import { useFlow } from '../hooks/useFlow';
import { SourceNode } from './nodes/SourceNode';
import { LayerNode } from './nodes/LayerNode';
import { NodePanel } from './NodePanel';
import { Box } from '@mui/material';
import { NodeType } from '../types/flow';
import '@xyflow/react/dist/style.css';

const nodeTypes: NodeTypes = {
     source: SourceNode,
     layer: LayerNode,
};

export const Flow = () => {
     const { nodes, edges, onNodesChange, onEdgesChange, addNode, onConnect } = useFlow();

     const onDrop = useCallback(
          (event: React.DragEvent) => {
               event.preventDefault();

               const type = event.dataTransfer.getData('application/reactflow') as NodeType;
               if (typeof type === 'undefined' || !type) {
                    return;
               }

               const reactFlowBounds = event.currentTarget.getBoundingClientRect();
               const position = {
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
               };

               addNode(type, position);
          },
          [addNode]
     );

     const onDragOver = useCallback((event: React.DragEvent) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
     }, []);

     return (
          <Box sx={{ width: '100%', height: '100%' }}>
               <NodePanel />
               <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
               >
                    <Background />
                    <Controls />
                    <MiniMap />
               </ReactFlow>
          </Box>
     );
};
