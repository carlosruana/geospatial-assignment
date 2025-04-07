import { useCallback, useState, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, NodeTypes, Node } from '@xyflow/react';
import { useFlow } from '../hooks/useFlow';
import { SourceNode } from './nodes/SourceNode';
import { LayerNode } from './nodes/LayerNode';
import { IntersectionNode } from './nodes/IntersectionNode';
import { NodePanel } from './NodePanel';
import { Box } from '@mui/material';
import { NodeType } from '../types/flow';
import '@xyflow/react/dist/style.css';

export const Flow = () => {
     const { nodes, edges, onNodesChange, onEdgesChange, addNode, onConnect, updateNodeData } =
          useFlow();
     const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

     const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
          setSelectedNodeId(node.id);
     }, []);

     const onPaneClick = useCallback(() => {
          setSelectedNodeId(null);
     }, []);

     const nodeTypes = useMemo<NodeTypes>(
          () => ({
               source: props => (
                    <SourceNode
                         id={props.id}
                         data={props.data}
                         selected={props.id === selectedNodeId}
                         updateNodeData={updateNodeData}
                    />
               ),
               layer: props => (
                    <LayerNode data={props.data} selected={props.id === selectedNodeId} />
               ),
               intersection: props => <IntersectionNode selected={props.id === selectedNodeId} />,
          }),
          [selectedNodeId, updateNodeData]
     );

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
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    fitView
               >
                    <Background />
                    <Controls />
                    <MiniMap />
               </ReactFlow>
          </Box>
     );
};
