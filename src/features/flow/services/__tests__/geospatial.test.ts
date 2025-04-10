import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGeoJSON } from '../geospatial';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('geospatial service', () => {
     beforeEach(() => {
          vi.clearAllMocks();
     });

     it('handles standard GeoJSON FeatureCollection', async () => {
          const mockFeatureCollection = {
               type: 'FeatureCollection',
               features: [
                    {
                         type: 'Feature',
                         geometry: {
                              type: 'Polygon',
                              coordinates: [
                                   [
                                        [0, 0],
                                        [1, 0],
                                        [1, 1],
                                        [0, 1],
                                        [0, 0],
                                   ],
                              ],
                         },
                         properties: {},
                    },
               ],
          };

          mockFetch.mockResolvedValueOnce({
               json: () => Promise.resolve(mockFeatureCollection),
          });

          const result = await fetchGeoJSON('https://example.com/data.geojson');
          expect(result).toEqual(mockFeatureCollection);
     });

     it('handles single GeoJSON Feature', async () => {
          const mockFeature = {
               type: 'Feature',
               geometry: {
                    type: 'Polygon',
                    coordinates: [
                         [
                              [0, 0],
                              [1, 0],
                              [1, 1],
                              [0, 1],
                              [0, 0],
                         ],
                    ],
               },
               properties: {},
          };

          mockFetch.mockResolvedValueOnce({
               json: () => Promise.resolve(mockFeature),
          });

          const result = await fetchGeoJSON('https://example.com/data.geojson');
          expect(result).toEqual({
               type: 'FeatureCollection',
               features: [mockFeature],
          });
     });

     it('throws error for invalid GeoJSON', async () => {
          const mockInvalidData = {
               type: 'Feature',
               geometry: {
                    type: 'Unknown',
                    coordinates: [],
               },
          };

          mockFetch.mockResolvedValueOnce({
               json: () => Promise.resolve(mockInvalidData),
          });

          await expect(fetchGeoJSON('https://example.com/data.geojson')).rejects.toThrow(
               'Invalid GeoJSON'
          );
     });

     it('throws error for network failure', async () => {
          mockFetch.mockRejectedValueOnce(new Error('Network error'));

          await expect(fetchGeoJSON('https://example.com/data.geojson')).rejects.toThrow(
               'Network error'
          );
     });
});
