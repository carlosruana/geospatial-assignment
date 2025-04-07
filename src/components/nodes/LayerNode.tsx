import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography } from '@mui/material';
import { LayerNodeData } from '../../types/flow';

interface LayerNodeProps {
     data: LayerNodeData;
     selected: boolean;
}

export const LayerNode = memo(({ data, selected }: LayerNodeProps) => {
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
               <Handle type="target" position={Position.Left} />
               <Typography>Layer {data.layerId}</Typography>
          </Box>
     );
});
