import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Box, Typography } from '@mui/material';
import type { IntersectionNodeType } from '../../types/flow';

export const IntersectionNode = memo(({ selected }: NodeProps<IntersectionNodeType>) => {
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
               <Handle type="source" position={Position.Right} />
               <Typography variant="subtitle2">Intersection</Typography>
          </Box>
     );
});
