export type NodeType = 'source' | 'layer' | 'intersection';

export interface SourceNodeData {
     url: string;
}

export interface LayerNodeData {
     layerId: number;
}

export interface IntersectionNodeData {
     operation: 'intersection' | 'difference' | 'union';
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
