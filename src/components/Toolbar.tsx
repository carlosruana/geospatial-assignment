import { Box, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NodeType } from '../types/flow';

interface ToolbarProps {
     onAddNode: (type: NodeType) => void;
}

export const Toolbar = ({ onAddNode }: ToolbarProps) => {
     return (
          <Box
               sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 4,
                    bgcolor: 'background.paper',
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 1,
               }}
          >
               <Stack direction="row" spacing={1}>
                    <Button
                         variant="contained"
                         startIcon={<AddIcon />}
                         onClick={() => onAddNode('source')}
                    >
                         Add Source
                    </Button>
                    <Button
                         variant="contained"
                         startIcon={<AddIcon />}
                         onClick={() => onAddNode('layer')}
                    >
                         Add Layer
                    </Button>
               </Stack>
          </Box>
     );
};
