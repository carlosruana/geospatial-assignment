import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Box, Typography } from '@mui/material';
import { Feature, Polygon, MultiPolygon } from 'geojson';

type LayerNodeData = {
     layerId: number;
     geometry?: Feature<Polygon | MultiPolygon>;
};

type LayerNode = Node<LayerNodeData, 'layer'>;

export const LayerNode = memo(({ selected }: NodeProps<LayerNode>) => {
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
