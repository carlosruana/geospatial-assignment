import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Box, Typography } from '@mui/material';
import type { LayerNodeType } from '../../types/flow';

export const LayerNode = memo(({ selected }: NodeProps<LayerNodeType>) => {
     return (
          <Box
               sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    minWidth: 150,
                    textAlign: 'center',
                    border: selected ? '2px solid' : '1px solid',
                    borderColor: selected ? 'primary.main' : 'divider',
               }}
          >
               <Handle type="target" position={Position.Left} />
               <Typography variant="subtitle2">Layer</Typography>
          </Box>
     );
});
