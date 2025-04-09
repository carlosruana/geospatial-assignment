import { memo, useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { TextField, Box, Typography } from '@mui/material';
import { fetchGeoJSON } from '../../../../features/geospatial/utils/geospatial';
import { isValidUrl } from '../../../../utils/validation';
import type { SourceNodeType } from '../../types/flow';

export const SourceNode = memo(({ id, data, selected }: NodeProps<SourceNodeType>) => {
     const [url, setUrl] = useState(data.url);
     const { updateNodeData } = useReactFlow();

     useEffect(() => {
          setUrl(data.url);
     }, [data.url]);

     const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
          const newUrl = event.target.value;
          setUrl(newUrl);
     }, []);

     const handleUrlBlur = useCallback(async () => {
          if (!url.trim()) {
               updateNodeData(id, { url: '', geojson: undefined });
               return;
          }

          if (isValidUrl(url)) {
               try {
                    const geojson = await fetchGeoJSON(url);
                    updateNodeData(id, { url, geojson, isValid: true });
               } catch (error) {
                    console.error('Error fetching GeoJSON:', error);
                    updateNodeData(id, {
                         url,
                         geojson: undefined,
                         isValid: false,
                         error: error instanceof Error ? error.message : 'Failed to fetch GeoJSON',
                    });
               }
          } else {
               updateNodeData(id, {
                    url,
                    geojson: undefined,
                    isValid: false,
                    error: 'Invalid URL',
               });
          }
     }, [url, id, updateNodeData]);

     const hasError = !isValidUrl(url) && url !== '';
     const isLoaded = data.url && data.geojson;

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
                         onBlur={handleUrlBlur}
                         fullWidth
                         size="small"
                         error={hasError}
                         helperText={hasError ? 'Please enter a valid URL' : ''}
                    />
                    {isLoaded && (
                         <Typography variant="caption" color="success.main">
                              GeoJSON loaded
                         </Typography>
                    )}
                    {data.error && (
                         <Typography variant="caption" color="error.main">
                              {data.error}
                         </Typography>
                    )}
               </Box>
          </Box>
     );
});
