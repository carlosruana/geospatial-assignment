import { memo, useState } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { TextField, Box, Typography } from '@mui/material';
//import { SourceNodeData } from '../../types/flow';
import { isValidUrl } from '../../utils/validation';
import { useFlow } from '../../hooks/useFlow';
import { Feature, Polygon, MultiPolygon } from 'geojson';

type SourceNode = Node<
     {
          id: string;
          url: string;
          selected: boolean;
          //updateNodeData: (nodeId: string, data: Partial<SourceNodeData>) => void;
          geojson?: Feature<Polygon | MultiPolygon>;
     },
     'source'
>;

export const SourceNode = memo(({ id, data, selected }: NodeProps<SourceNode>) => {
     const [url, setUrl] = useState(data.url);
     const [error, setError] = useState<string | null>(null);
     const { updateNodeData } = useFlow();

     const handleUrlChange = async (newUrl: string) => {
          setUrl(newUrl);
          if (newUrl && !isValidUrl(newUrl)) {
               setError('Please enter a valid URL');
          } else {
               setError(null);
               try {
                    const response = await fetch(newUrl);
                    const geojson = await response.json();
                    updateNodeData(id, { url: newUrl, geojson });
               } catch (error) {
                    console.error('Error fetching GeoJSON data:', error);
                    setError('Failed to fetch GeoJSON data');
               }
          }
     };

     return (
          <Box
               sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    border: selected ? '2px solid' : '1px solid',
                    borderColor: selected ? 'primary.main' : 'divider',
               }}
          >
               <Handle type="source" position={Position.Right} />
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                         label="Source URL"
                         value={url}
                         onChange={e => handleUrlChange(e.target.value)}
                         size="small"
                         error={!!error}
                         helperText={error}
                    />
                    {!error && url && data.geojson && (
                         <Typography variant="caption" color="success.main">
                              GeoJSON loaded
                         </Typography>
                    )}
               </Box>
          </Box>
     );
});
