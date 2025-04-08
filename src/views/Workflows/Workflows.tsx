import { useState, useMemo } from 'react';
import { Box, IconButton } from '@mui/material';
import { Map as MapIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Flow } from '../../components/Flow';
import { GeospatialViewer } from '../../components/GeospatialViewer';
import { useFlow } from '../../hooks/useFlow';
import { Feature, Polygon, MultiPolygon } from 'geojson';

export const Workflows = () => {
     const { nodes } = useFlow();
     const [showMap, setShowMap] = useState(false);

     const features = useMemo(() => {
          return nodes
               .filter(node => node.type === 'layer')
               .map(node => node.data.geometry as Feature<Polygon | MultiPolygon>);
     }, [nodes]);

     return (
          <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
               {!showMap ? <Flow /> : <GeospatialViewer features={features} />}
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
          </Box>
     );
};
