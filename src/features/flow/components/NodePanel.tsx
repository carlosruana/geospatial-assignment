import { useCallback } from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import { NodeType } from '../types/flow';

const nodeTypes: { type: NodeType; label: string }[] = [
     { type: 'source', label: 'Source URL' },
     { type: 'layer', label: 'Layer' },
     { type: 'intersection', label: 'Intersection' },
];

const getNodeStyles = (type: NodeType) => {
     if (type === 'source') {
          return {
               '&::before': {
                    content: '""',
                    position: 'absolute',
                    right: -6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#555',
               },
          };
     }
     if (type === 'layer') {
          return {
               '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#555',
               },
          };
     }
     return {
          '&::before': {
               content: '""',
               position: 'absolute',
               left: -6,
               top: '50%',
               transform: 'translateY(-50%)',
               width: 8,
               height: 8,
               borderRadius: '50%',
               backgroundColor: '#555',
          },
          '&::after': {
               content: '""',
               position: 'absolute',
               right: -6,
               top: '50%',
               transform: 'translateY(-50%)',
               width: 8,
               height: 8,
               borderRadius: '50%',
               backgroundColor: '#555',
          },
     };
};

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
                                   ...getNodeStyles(type),
                              }}
                              draggable
                              onDragStart={e => onDragStart(e, type)}
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
                    ))}
               </Paper>
          </Box>
     );
};
