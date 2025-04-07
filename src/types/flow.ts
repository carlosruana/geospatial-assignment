import { Node, Edge } from '@xyflow/react';

export type NodeType = 'source' | 'layer' | 'intersection';

export interface SourceNodeData {
     url: string;
     [key: string]: unknown;
}

export interface LayerNodeData {
     layerId: string;
     [key: string]: unknown;
}

export interface IntersectionNodeData {
     sourceIds: string[];
     [key: string]: unknown;
}

export type CustomNode = Node<SourceNodeData | LayerNodeData | IntersectionNodeData>;
export type CustomEdge = Edge;
