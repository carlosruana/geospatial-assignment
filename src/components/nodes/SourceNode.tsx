import { memo, useCallback, useState } from 'react';
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
     const [inputValue, setInputValue] = useState(data.url);
     const { updateNodeData } = useReactFlow();

     const handleUrlChange = useCallback(
          (event: React.ChangeEvent<HTMLInputElement>) => {
               const newUrl = event.target.value;
               console.log('SourceNode handleUrlChange:', {
                    newUrl,
                    currentData: JSON.stringify(data),
               });
               setInputValue(newUrl);

               if (!newUrl.trim()) {
                    console.log('Clearing URL and GeoJSON');
                    updateNodeData(id, { url: '', geojson: undefined });
                    return;
               }

               if (isValidUrl(newUrl)) {
                    console.log('Fetching GeoJSON for URL:', newUrl);
                    fetchGeoJSON(newUrl)
                         .then((geojson: Feature<Polygon | MultiPolygon>) => {
                              console.log('GeoJSON fetched successfully:', geojson);
                              updateNodeData(id, { url: newUrl, geojson });
                         })
                         .catch((error: Error) => {
                              console.error('Error fetching GeoJSON:', error);
                              updateNodeData(id, { url: newUrl, geojson: undefined });
                         });
               } else {
                    console.log('Invalid URL:', newUrl);
                    updateNodeData(id, { url: newUrl, geojson: undefined });
               }
          },
          [id, updateNodeData, data]
     );

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
                         value={inputValue}
                         onChange={handleUrlChange}
                         size="small"
                         error={!isValidUrl(inputValue) && inputValue !== ''}
                         helperText={
                              !isValidUrl(inputValue) && inputValue !== ''
                                   ? 'Please enter a valid URL'
                                   : ''
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
