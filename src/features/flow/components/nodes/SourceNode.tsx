import { memo, useState, useCallback, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { TextField, Box, Typography } from '@mui/material';
import { fetchGeoJSON } from '../../../../features/geospatial/utils/geospatial';
import { isValidUrl } from '../../../../utils/validation';
import type { SourceNodeType } from '../../types/flow';
import { LoadingSpinner } from '../../../../shared/components/LoadingSpinner';

export const SourceNode = memo(({ id, data, selected }: NodeProps<SourceNodeType>) => {
     const [url, setUrl] = useState(data.url || '');
     const [isLoading, setIsLoading] = useState(false);
     const inputRef = useRef<HTMLInputElement>(null);
     const { updateNodeData } = useReactFlow();

     const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
          const newUrl = e.target.value;
          setUrl(newUrl);
     }, []);

     const handleUrlBlur = useCallback(async () => {
          if (!url) {
               updateNodeData(id, { url: '', geojson: undefined, error: undefined });
               return;
          }

          if (!isValidUrl(url)) {
               updateNodeData(id, {
                    url,
                    geojson: undefined,
                    isValid: false,
                    error: 'Invalid URL',
               });
               return;
          }

          updateNodeData(id, { url });
          setIsLoading(true);
          try {
               const geojson = await fetchGeoJSON(url);
               updateNodeData(id, { url, geojson, isValid: true, error: undefined });
          } catch (error) {
               console.error('Error fetching GeoJSON:', error);
               updateNodeData(id, {
                    url,
                    geojson: undefined,
                    isValid: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch GeoJSON',
               });
          } finally {
               setIsLoading(false);
          }
     }, [url, id, updateNodeData]);

     const handleKeyDown = useCallback(
          (e: React.KeyboardEvent) => {
               if (e.key === 'Enter') {
                    e.preventDefault();
                    inputRef.current?.blur();
                    handleUrlBlur();
               }
          },
          [handleUrlBlur]
     );

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
                         onKeyDown={handleKeyDown}
                         fullWidth
                         size="small"
                         inputRef={inputRef}
                    />
                    {isLoading && (
                         <Box
                              sx={{
                                   display: 'flex',
                                   height: '20px',
                                   alignItems: 'center',
                                   gap: 1,
                              }}
                         >
                              <Typography variant="caption" color="text.secondary">
                                   Loading GeoJSON
                              </Typography>
                              <LoadingSpinner />
                         </Box>
                    )}
                    {isLoaded && !isLoading && (
                         <Typography variant="caption" color="success.main">
                              GeoJSON loaded
                         </Typography>
                    )}
                    {data.error && !isLoading && (
                         <Typography variant="caption" color="error.main">
                              {data.error}
                         </Typography>
                    )}
               </Box>
          </Box>
     );
});
