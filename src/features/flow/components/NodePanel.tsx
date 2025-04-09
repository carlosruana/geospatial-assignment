import { useCallback } from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import { NodeType } from '../types/flow';
import { Handle, Position } from '@xyflow/react';

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
                              {type === 'source' && (
                                   <>
                                        <Handle
                                             type="source"
                                             position={Position.Right}
                                             style={{ background: '#555' }}
                                        />
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
                                   </>
                              )}
                              {type === 'layer' && (
                                   <>
                                        <Handle
                                             type="target"
                                             position={Position.Left}
                                             style={{ background: '#555' }}
                                        />
                                        <Typography variant="subtitle2">{label}</Typography>
                                   </>
                              )}
                              {type === 'intersection' && (
                                   <>
                                        <Handle
                                             type="target"
                                             position={Position.Left}
                                             style={{ background: '#555' }}
                                        />
                                        <Handle
                                             type="source"
                                             position={Position.Right}
                                             style={{ background: '#555' }}
                                        />
                                        <Typography variant="subtitle2">{label}</Typography>
                                   </>
                              )}
                         </Box>
                    ))}
               </Paper>
          </Box>
     );
};
