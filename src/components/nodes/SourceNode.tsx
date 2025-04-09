import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow, Node } from '@xyflow/react';
import { TextField, Box, Typography } from '@mui/material';
import { Feature, Polygon, MultiPolygon } from 'geojson';
import { fetchGeoJSON } from '../../utils/geospatial';
import { isValidUrl } from '../../utils/validation';

type SourceNodeData = {
     url: string;
     geojson?: Feature<Polygon | MultiPolygon>;
};

type SourceNode = Node<SourceNodeData, 'source'>;

export const SourceNode = memo(({ id, data, selected }: NodeProps<SourceNode>) => {
     console.log('SourceNode render:', {
          id,
          data: JSON.stringify(data),
          selected,
     });
     const [url, setUrl] = useState(data.url);
     const { updateNodeData, getNodes } = useReactFlow();

     // Update local state when node data changes
     useEffect(() => {
          setUrl(data.url);
     }, [data.url]);

     // Fetch GeoJSON when URL changes or on initial load
     useEffect(() => {
          const fetchData = async () => {
               console.log('fetchData called for node:', id, {
                    url,
                    isValid: isValidUrl(url),
               });

               if (url && isValidUrl(url)) {
                    console.log('Attempting to fetch GeoJSON for node:', id);
                    try {
                         const geojson = await fetchGeoJSON(url);
                         console.log('GeoJSON fetched successfully for node:', id, geojson);

                         updateNodeData(id, { url, geojson });

                         // Verify the update by checking all nodes
                         const nodes = getNodes();
                         const updatedNode = nodes.find(n => n.id === id);
                         console.log('Node after update:', updatedNode);
                    } catch (error) {
                         console.error('Error fetching GeoJSON:', error);
                         updateNodeData(id, { url, geojson: undefined });
                    }
               } else {
                    console.log('Skipping fetch for node:', id, {
                         reason: !url ? 'no url' : 'invalid url',
                    });
               }
          };
          fetchData();
     }, [url, id, updateNodeData, getNodes]);

     const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const newUrl = event.target.value;
          setUrl(newUrl);
          if (!newUrl.trim()) {
               updateNodeData(id, { url: '', geojson: undefined });
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
                         onChange={handleUrlChange}
                         fullWidth
                         size="small"
                         error={!isValidUrl(url) && url !== ''}
                         helperText={
                              !isValidUrl(url) && url !== '' ? 'Please enter a valid URL' : ''
                         }
                    />
                    {data.url && data.geojson && (
                         <Typography variant="caption" color="success.main">
                              GeoJSON loaded
                         </Typography>
                    )}
               </Box>
          </Box>
     );
});
