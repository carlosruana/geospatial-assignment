import { useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { NodeType } from '../types/flow';

const nodeTypes: { type: NodeType; label: string }[] = [
     { type: 'source', label: 'Source' },
     { type: 'layer', label: 'Layer' },
     { type: 'intersection', label: 'Intersection' },
];

export const NodePanel = () => {
     const onDragStart = useCallback((event: React.DragEvent, nodeType: NodeType) => {
          event.dataTransfer.setData('application/workflows', nodeType);
          event.dataTransfer.effectAllowed = 'move';
     }, []);

     return (
          <Box
               sx={{
                    position: 'absolute',
                    left: 10,
                    top: 10,
                    zIndex: 4,
               }}
          >
               <Paper
                    sx={{
                         p: 2,
                         display: 'flex',
                         flexDirection: 'column',
                         gap: 2,
                    }}
               >
                    <Typography variant="h6">Nodes</Typography>
                    {nodeTypes.map(({ type, label }) => (
                         <Box
                              key={type}
                              sx={{
                                   p: 2,
                                   border: '1px solid',
                                   borderColor: 'divider',
                                   borderRadius: 1,
                                   cursor: 'grab',
                              }}
                              draggable
                              onDragStart={e => onDragStart(e, type)}
                         >
                              {label}
                         </Box>
                    ))}
               </Paper>
          </Box>
     );
};
