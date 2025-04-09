import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Map as MapIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Flow } from '../../components/Flow';
import { GeospatialViewer } from '../../components/GeospatialViewer';
import { ReactFlowProvider } from '@xyflow/react';

export const Workflows = () => {
     const [showMap, setShowMap] = useState(false);

     return (
          <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
               {/* ReactFlowProvider is required for the Flow component to work with
               screenToFlowPosition to drag and drop and other features
               https://reactflow.dev/learn/troubleshooting#001
               https://xyflow.dev/docs/react-flow-provider */}
               <ReactFlowProvider>
                    {!showMap ? <Flow /> : <GeospatialViewer />}
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
                         {showMap ? <ArrowBackIcon /> : <MapIcon />}
                    </IconButton>
               </ReactFlowProvider>
          </Box>
     );
};
