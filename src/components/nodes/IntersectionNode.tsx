import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { IntersectionNodeData } from '../../types/flow';

interface IntersectionNodeProps {
     data: IntersectionNodeData;
     selected: boolean;
}

export const IntersectionNode = memo(({ data, selected }: IntersectionNodeProps) => {
     const [operation, setOperation] = useState<IntersectionNodeData['operation']>(
          data.operation || 'intersection'
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
               <Handle type="target" position={Position.Left} />
               <Handle type="source" position={Position.Right} />
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle2">Intersection</Typography>
                    <FormControl size="small">
                         <InputLabel>Operation</InputLabel>
                         <Select
                              value={operation}
                              label="Operation"
                              onChange={e =>
                                   setOperation(e.target.value as IntersectionNodeData['operation'])
                              }
                         >
                              <MenuItem value="intersection">Intersection</MenuItem>
                              <MenuItem value="difference">Difference</MenuItem>
                              <MenuItem value="union">Union</MenuItem>
                         </Select>
                    </FormControl>
               </Box>
          </Box>
     );
});
