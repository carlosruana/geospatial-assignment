export const NODE_TYPES = {
     SOURCE: 'source',
     LAYER: 'layer',
     INTERSECTION: 'intersection',
} as const;

export const STORAGE_KEY = 'flow-diagram-state';

export const DEFAULT_NODE_STYLES = {
     width: 180,
     height: 40,
     borderRadius: 8,
};

export const NODE_COLORS = {
     source: '#1976d2',
     layer: '#dc004e',
     intersection: '#2e7d32',
} as const;
