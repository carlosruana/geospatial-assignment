import { Edge, Node } from '@xyflow/react';
import { Feature, Polygon, MultiPolygon, Point, FeatureCollection } from 'geojson';

export type NodeType = 'source' | 'layer' | 'intersection';

export type NodePosition = {
     x: number;
     y: number;
};

export type Viewport = {
     x: number;
     y: number;
     zoom: number;
};

export type GeoJSONProperties = {
     name?: string;
     description?: string;
     [key: string]: string | number | boolean | undefined;
};

export type GeoJSONFeature = Feature<Polygon | MultiPolygon | Point, GeoJSONProperties>;

export type SourceNodeData = {
     url: string;
     geojson?: FeatureCollection<Polygon | MultiPolygon | Point>;
     isValid?: boolean;
     error?: string;
};

export type LayerNodeData = {
     geojson?: GeoJSONFeature;
     name?: string;
     visible: boolean;
     opacity: number;
     color: string;
};

export type IntersectionNodeData = {
     operation: 'intersection';
     geojson?: GeoJSONFeature;
     inputLayers: string[]; // IDs of the input layer nodes
     isValid: boolean;
};

export type SourceNodeType = Node<SourceNodeData, 'source'> & {
     type: 'source';
     position: NodePosition;
     data: SourceNodeData;
};

export type LayerNodeType = Node<LayerNodeData, 'layer'> & {
     type: 'layer';
     position: NodePosition;
     data: LayerNodeData;
};

export type IntersectionNodeType = Node<IntersectionNodeData, 'intersection'> & {
     type: 'intersection';
     position: NodePosition;
     data: IntersectionNodeData;
};

export type CustomNode = SourceNodeType | LayerNodeType | IntersectionNodeType;
export type CustomEdge = Edge;

export type FlowState = {
     nodes: CustomNode[];
     edges: CustomEdge[];
     viewport: Viewport;
     selectedNodeId?: string;
     selectedEdgeId?: string;
};

// Validation types
export type NodeValidation = {
     isValid: boolean;
     errors: string[];
};

export type SourceNodeValidation = NodeValidation & {
     urlError?: string;
     geojsonError?: string;
};

export type LayerNodeValidation = NodeValidation & {
     geojsonError?: string;
     nameError?: string;
};

export type IntersectionNodeValidation = NodeValidation & {
     inputLayersError?: string;
     geojsonError?: string;
};
