import { memo } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { Box, Typography } from '@mui/material';
import { Feature, Polygon, MultiPolygon } from 'geojson';

type LayerNode = Node<
     {
          layerId: number;
          geometry?: Feature<Polygon | MultiPolygon>;
     },
     'layer'
>;

export const LayerNode = memo(({ selected, data }: NodeProps<LayerNode>) => {
     return (
          <Box
               sx={{
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    backgroundColor: 'white',
                    minWidth: 150,
                    borderColor: selected ? '#1976d2' : '#ddd',
               }}
          >
               <Handle type="target" position={Position.Left} />
               <Typography variant="subtitle2">Layer {data.layerId}</Typography>
               {data.geometry && (
                    <Typography variant="caption" color="text.secondary">
                         GeoJSON loaded
                    </Typography>
               )}
          </Box>
     );
});
