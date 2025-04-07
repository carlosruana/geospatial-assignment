import { Feature, Polygon, MultiPolygon } from 'geojson';

export type NodeType = 'source' | 'layer' | 'intersection';

export interface SourceNodeData {
     url: string;
}

export interface LayerNodeData {
     layerId: number;
     geometry: Feature<Polygon | MultiPolygon>;
}

export interface IntersectionNodeData {
     operation: 'intersection';
}

export interface CustomNode {
     id: string;
     type: NodeType;
     position: { x: number; y: number };
     data: SourceNodeData | LayerNodeData | IntersectionNodeData;
}

export interface CustomEdge {
     id: string;
     source: string;
     target: string;
}
