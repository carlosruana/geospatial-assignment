import intersect from '@turf/intersect';
import { featureCollection } from '@turf/helpers';
import { Feature, Polygon, MultiPolygon } from 'geojson';

export const performIntersection = (
     feature1: Feature<Polygon | MultiPolygon>,
     feature2: Feature<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null => {
     try {
          const collection = featureCollection([feature1, feature2]);
          const result = intersect(collection);
          return result as Feature<Polygon | MultiPolygon> | null;
     } catch (error) {
          console.error('Error performing intersection:', error);
          return null;
     }
};

export const fetchGeoJSON = async (url: string): Promise<Feature<Polygon | MultiPolygon>> => {
     const response = await fetch(url);
     const data = await response.json();

     if (data.type === 'FeatureCollection' && data.features?.length > 0) {
          // Return the first feature if it's a FeatureCollection
          return data.features[0] as Feature<Polygon | MultiPolygon>;
     }

     if (data.type === 'Feature' && data.geometry) {
          return data as Feature<Polygon | MultiPolygon>;
     }

     throw new Error('Invalid GeoJSON format');
};
