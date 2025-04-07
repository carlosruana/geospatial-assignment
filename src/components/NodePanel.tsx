import { Box, Paper, Typography } from '@mui/material';
import { NodeType } from '../types/flow';

interface NodeItemProps {
     type: NodeType;
     label: string;
}

const NodeItem = ({ type, label }: NodeItemProps) => {
     const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
          event.dataTransfer.setData('application/reactflow', nodeType);
          event.dataTransfer.effectAllowed = 'move';
     };

     return (
          <Box
               draggable
               onDragStart={e => onDragStart(e, type)}
               sx={{
                    cursor: 'move',
                    p: 1,
                    mb: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    '&:hover': {
                         bgcolor: 'action.hover',
                    },
               }}
          >
               <Typography variant="body2">{label}</Typography>
          </Box>
     );
};

export const NodePanel = () => {
     return (
          <Paper
               sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 4,
                    p: 2,
                    width: 200,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 3,
               }}
          >
               <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Nodes
               </Typography>
               <NodeItem type="source" label="Source Node" />
               <NodeItem type="layer" label="Layer Node" />
               <NodeItem type="intersection" label="Intersection Node" />
          </Paper>
     );
};
