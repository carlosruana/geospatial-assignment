import { useCallback, useState, useMemo } from 'react';
import {
     ReactFlow,
     Background,
     Controls,
     MiniMap,
     useReactFlow,
     Panel,
     ReactFlowInstance,
     OnNodesChange,
     OnEdgesChange,
     NodeTypes,
} from '@xyflow/react';
import { useFlow } from '../hooks/useFlow';
import { SourceNode } from './nodes/SourceNode';
import { LayerNode } from './nodes/LayerNode';
import { IntersectionNode } from './nodes/IntersectionNode';
import { NodePanel } from './NodePanel';
import { Box, Button } from '@mui/material';
import '@xyflow/react/dist/style.css';
import { STORAGE_KEY } from '../constants/flow';
import { CustomNode, CustomEdge } from '../types/flow';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';

const nodeTypes: NodeTypes = {
     source: SourceNode,
     layer: LayerNode,
     intersection: IntersectionNode,
};

interface FlowProps {
     nodes: CustomNode[];
     edges: CustomEdge[];
     setNodes: (nodes: CustomNode[]) => void;
     setEdges: (edges: CustomEdge[]) => void;
     onNodesChange: OnNodesChange<CustomNode>;
     onEdgesChange: OnEdgesChange;
}

export const Flow = ({
     nodes,
     edges,
     setNodes,
     setEdges,
     onNodesChange,
     onEdgesChange,
}: FlowProps) => {
     const { onConnect, addNode } = useFlow();
     const [rfInstance, setRfInstance] = useState<ReactFlowInstance<CustomNode, CustomEdge> | null>(
          null
     );
     const { setViewport, screenToFlowPosition } = useReactFlow();

     const onSave = useCallback(() => {
          if (rfInstance) {
               const flow = rfInstance.toObject();
               localStorage.setItem(STORAGE_KEY, JSON.stringify(flow));
          }
     }, [rfInstance]);

     const restoreFlow = useCallback(async () => {
          const flow = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');

          if (flow?.viewport) {
               const { x = 0, y = 0, zoom = 1 } = flow.viewport;
               setNodes(flow.nodes || []);
               setEdges(flow.edges || []);
               setViewport({ x, y, zoom });
          }
     }, [setEdges, setNodes, setViewport]);

     const onRestore = useCallback(() => {
          restoreFlow();
     }, [restoreFlow]);

     const onClear = useCallback(() => {
          setNodes([]);
          setEdges([]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
     }, [setEdges, setNodes]);

     const onDrop = useCallback(
          (event: React.DragEvent) => {
               event.preventDefault();

               const type = event.dataTransfer.getData('application/workflows') as
                    | 'source'
                    | 'layer'
                    | 'intersection';
               if (!type || !['source', 'layer', 'intersection'].includes(type)) {
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

     const panelContent = useMemo(
          () => (
               <Box
                    sx={{
                         display: 'flex',
                         gap: 1,
                         backgroundColor: 'white',
                         padding: 1,
                         borderRadius: 1,
                         boxShadow: 1,
                         marginLeft: 8,
                    }}
               >
                    <Button
                         variant="contained"
                         size="small"
                         onClick={onSave}
                         startIcon={<SaveIcon />}
                    >
                         Save
                    </Button>
                    <Button
                         variant="outlined"
                         size="small"
                         onClick={onRestore}
                         startIcon={<RestoreIcon />}
                    >
                         Restore
                    </Button>
                    <Button
                         variant="outlined"
                         size="small"
                         onClick={onClear}
                         startIcon={<DeleteIcon />}
                    >
                         Clear
                    </Button>
               </Box>
          ),
          [onSave, onRestore, onClear]
     );

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
                         onInit={setRfInstance}
                         onDrop={onDrop}
                         onDragOver={onDragOver}
                         nodeTypes={nodeTypes}
                         fitView
                    >
                         <Background />
                         <Controls />
                         <MiniMap />
                         <Panel position="bottom-left">{panelContent}</Panel>
                    </ReactFlow>
               </Box>
          </Box>
     );
};
