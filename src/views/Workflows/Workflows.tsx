import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Map as MapIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Flow } from '../../components/Flow';
import { GeospatialViewer } from '../../components/GeospatialViewer';
import { useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';

export const Workflows = () => {
     const [showMap, setShowMap] = useState(false);
     const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
     const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

     const getButtonIcon = () => {
          return showMap ? <ArrowBackIcon /> : <MapIcon />;
     };

     return (
          <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
               {!showMap ? (
                    <Flow
                         nodes={nodes}
                         edges={edges}
                         setNodes={setNodes}
                         setEdges={setEdges}
                         onNodesChange={onNodesChange}
                         onEdgesChange={onEdgesChange}
                    />
               ) : (
                    <GeospatialViewer nodes={nodes} edges={edges} />
               )}
               <IconButton
                    sx={{
                         position: 'absolute',
                         top: 10,
                         right: 10,
                         zIndex: 2,
                         backgroundColor: 'white',
                         '&:hover': {
                              backgroundColor: 'white',
                         },
                    }}
                    onClick={() => setShowMap(!showMap)}
               >
                    {getButtonIcon()}
               </IconButton>
          </Box>
     );
};
