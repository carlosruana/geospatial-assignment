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
