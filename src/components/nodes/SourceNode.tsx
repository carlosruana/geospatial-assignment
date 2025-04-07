import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TextField, Box } from '@mui/material';
import { SourceNodeData } from '../../types/flow';

interface SourceNodeProps {
     data: SourceNodeData;
}

export const SourceNode = memo(({ data }: SourceNodeProps) => {
     const [url, setUrl] = useState(data.url);

     return (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
               <Handle type="source" position={Position.Right} />
               <TextField
                    label="Source URL"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    size="small"
               />
          </Box>
     );
});
