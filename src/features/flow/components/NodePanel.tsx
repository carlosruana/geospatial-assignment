import { useCallback } from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import { NodeType } from '../types/flow';

const nodeTypes: { type: NodeType; label: string }[] = [
     { type: 'source', label: 'Source URL' },
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
                                   bgcolor: 'background.paper',
                                   borderRadius: 1,
                                   boxShadow: 1,
                                   border: '1px solid',
                                   borderColor: 'divider',
                                   cursor: 'grab',
                                   minWidth: 150,
                                   position: 'relative',
                                   textAlign: type === 'source' ? 'left' : 'center',
                              }}
                              draggable
                              onDragStart={e => onDragStart(e, type)}
                         >
                              <Box
                                   sx={{
                                        position: 'relative',
                                        '&::before':
                                             type !== 'source'
                                                  ? {
                                                         content: '""',
                                                         position: 'absolute',
                                                         left: -16,
                                                         top: '50%',
                                                         transform: 'translate(-50%, -50%)',
                                                         width: 8,
                                                         height: 8,
                                                         backgroundColor: '#000',
                                                         borderRadius: '50%',
                                                    }
                                                  : undefined,
                                        '&::after':
                                             type !== 'layer'
                                                  ? {
                                                         content: '""',
                                                         position: 'absolute',
                                                         right: -16,
                                                         top: '50%',
                                                         transform: 'translate(50%, -50%)',
                                                         width: 8,
                                                         height: 8,
                                                         backgroundColor: '#000',
                                                         borderRadius: '50%',
                                                    }
                                                  : undefined,
                                   }}
                              >
                                   {type === 'source' && (
                                        <Box
                                             sx={{
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  gap: 1,
                                             }}
                                        >
                                             <TextField
                                                  label={label}
                                                  size="small"
                                                  fullWidth
                                                  disabled
                                                  placeholder="Enter URL"
                                             />
                                        </Box>
                                   )}
                                   {type === 'layer' && (
                                        <Typography variant="subtitle2">{label}</Typography>
                                   )}
                                   {type === 'intersection' && (
                                        <Typography variant="subtitle2">{label}</Typography>
                                   )}
                              </Box>
                         </Box>
                    ))}
               </Paper>
          </Box>
     );
};
