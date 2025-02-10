import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const UpdateMapCenter = ({ center }: any) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center); // Dynamically update the map's center
  }, [center, map]);

  return null; // This component only acts as a helper and doesn't render anything
};

export default UpdateMapCenter;
