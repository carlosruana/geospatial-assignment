import { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { SourceNode } from '../SourceNode';
import { ReactFlowProvider } from '@xyflow/react';
import { fetchGeoJSON } from '../../../services/geospatial';

// Mock the geospatial service
vi.mock('../../../services/geospatial', () => ({
     fetchGeoJSON: vi.fn(),
}));

// Import actual ReactFlowProvider
vi.mock('@xyflow/react', async () => {
     const actual = await vi.importActual('@xyflow/react');
     return {
          ...actual,
     };
});

describe('SourceNode', () => {
     const defaultProps = {
          id: 'test-id',
          type: 'source' as const,
          data: {
               url: '',
               isValid: false,
               error: '',
          },
          position: { x: 0, y: 0 },
          selected: false,
          dragging: false,
          deletable: true,
          draggable: true,
          isConnectable: true,
          positionAbsoluteX: 0,
          positionAbsoluteY: 0,
          selectable: true,
          zIndex: 0,
     };

     function SourceNodeWrapper() {
          const [data] = useState(defaultProps.data);

          return (
               <ReactFlowProvider>
                    <SourceNode {...defaultProps} data={data} />
               </ReactFlowProvider>
          );
     }

     beforeEach(() => {
          vi.clearAllMocks();
     });

     it('renders with empty URL input', () => {
          render(<SourceNodeWrapper />);
          expect(screen.getByLabelText('Source URL')).toBeInTheDocument();
     });

     it('attempts to fetch GeoJSON for valid URL', async () => {
          const mockGeoJSON = { type: 'FeatureCollection', features: [] };
          (fetchGeoJSON as Mock).mockResolvedValueOnce(mockGeoJSON);

          render(<SourceNodeWrapper />);

          const input = screen.getByLabelText('Source URL');
          fireEvent.change(input, { target: { value: 'https://example.com/data.geojson' } });
          fireEvent.blur(input);

          await waitFor(() => {
               expect(fetchGeoJSON).toHaveBeenCalledWith('https://example.com/data.geojson');
          });
     });

     it('shows loading state while fetching', async () => {
          (fetchGeoJSON as Mock).mockImplementationOnce(() => new Promise(() => {})); // Keep the promise pending

          render(<SourceNodeWrapper />);

          const input = screen.getByLabelText('Source URL');
          fireEvent.change(input, { target: { value: 'https://example.com/data.geojson' } });
          fireEvent.blur(input);

          await waitFor(() => {
               expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
          });
     });
});
