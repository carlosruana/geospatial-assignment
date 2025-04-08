import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, useReactFlow } from '@xyflow/react';
import { useFlow } from '../hooks/useFlow';
import { SourceNode } from './nodes/SourceNode';
import { LayerNode } from './nodes/LayerNode';
import { IntersectionNode } from './nodes/IntersectionNode';
import { NodePanel } from './NodePanel';
import { Box } from '@mui/material';
import { NodeType } from '../types/flow';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
     source: SourceNode,
     layer: LayerNode,
     intersection: IntersectionNode,
};

export const Flow = () => {
     const { nodes, edges, onNodesChange, onEdgesChange, addNode, onConnect } = useFlow();
     const { screenToFlowPosition } = useReactFlow();
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

     const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
          setSelectedNodeId(node.id);
     }, []);

     const onPaneClick = useCallback(() => {
          setSelectedNodeId(null);
     }, []);

     const onDrop = useCallback(
          (event: React.DragEvent) => {
               event.preventDefault();

               const type = event.dataTransfer.getData('application/reactflow') as NodeType;
               if (typeof type === 'undefined' || !type) {
                    return;
               }

               const position = screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
               });

               addNode(type, position);
          },
          [addNode, screenToFlowPosition]
     );

     const onDragOver = useCallback((event: React.DragEvent) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
     }, []);

     return (
          <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
               <NodePanel />
               <Box sx={{ flex: 1, position: 'relative' }}>
                    <ReactFlow
                         nodes={nodes}
                         edges={edges}
                         onNodesChange={onNodesChange}
                         onEdgesChange={onEdgesChange}
                         onConnect={onConnect}
                         onDrop={onDrop}
                         onDragOver={onDragOver}
                         nodeTypes={nodeTypes}
                         onNodeClick={onNodeClick}
                         onPaneClick={onPaneClick}
                         fitView
                    >
                         <Background />
                         <Controls />
                         <MiniMap />
                    </ReactFlow>
               </Box>
          </Box>
     );
};
