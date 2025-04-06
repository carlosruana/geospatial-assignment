import { Node, Edge } from '@xyflow/react';

export type NodeType = 'source' | 'layer' | 'intersection';

export interface SourceNodeData {
     url: string;
}

export interface LayerNodeData {
     // Add layer-specific data here
}

export interface IntersectionNodeData {
     // Add intersection-specific data here
}

export type CustomNode = Node<SourceNodeData | LayerNodeData | IntersectionNodeData>;
export type CustomEdge = Edge;
