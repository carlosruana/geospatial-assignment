import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
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
               <Box
                    onClick={() => setShowMap(!showMap)}
                    sx={{
                         position: 'absolute',
                         top: 10,
                         right: 10,
                         zIndex: 2,
                         display: 'flex',
                         alignItems: 'center',
                         gap: 1,
                         backgroundColor: 'white',
                         padding: '4px 8px',
                         borderRadius: 1,
                         boxShadow: 1,
                         cursor: 'pointer',
                         '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                         },
                    }}
               >
                    <IconButton
                         sx={{
                              padding: 0,
                              '&:hover': {
                                   backgroundColor: 'transparent',
                              },
                         }}
                    >
                         {getButtonIcon()}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                         {showMap ? 'Back' : 'Map'}
                    </Typography>
               </Box>
          </Box>
     );
};
