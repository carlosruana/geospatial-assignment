import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TextField, Box, Typography } from '@mui/material';
import { SourceNodeData } from '../../types/flow';
import { isValidUrl } from '../../utils/validation';

interface SourceNodeProps {
     id: string;
     data: SourceNodeData;
     selected: boolean;
     updateNodeData: (nodeId: string, data: Partial<SourceNodeData>) => void;
}

export const SourceNode = memo(({ id, data, selected, updateNodeData }: SourceNodeProps) => {
     const [url, setUrl] = useState(data.url);
     const [error, setError] = useState<string | null>(null);

     const handleUrlChange = (newUrl: string) => {
          setUrl(newUrl);
          if (newUrl && !isValidUrl(newUrl)) {
               setError('Please enter a valid URL');
          } else {
               setError(null);
               updateNodeData(id, { url: newUrl });
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
                    {!error && url && (
                         <Typography variant="caption" color="success.main">
                              Valid URL
                         </Typography>
                    )}
               </Box>
          </Box>
     );
});
