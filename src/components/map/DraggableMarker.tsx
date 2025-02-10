import { Icon } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import markerIcon from '../../assets/images/marker.svg';

const DraggableMarker = ({ isDraggable, position, setPosition, onMarkerDragEnd, showPopup = false }: any) => {
  const markerRef = useRef<any>(null);
  const [localPosition, setLocalPosition] = useState({
    lat: position.latitude,
    lng: position.longitude
  });

  // Sync localPosition with the parent position prop when it changes
  useEffect(() => {
    setLocalPosition({
      lat: position.latitude,
      lng: position.longitude
    });
  }, [position]);

  const myIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: [32, 32]
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setLocalPosition(newPos);
          setPosition({
            latitude: newPos.lat,
            longitude: newPos.lng
          }); // Update parent state
          // Notify parent component about the new position
          if (onMarkerDragEnd) {
            onMarkerDragEnd({
              latitude: newPos.lat,
              longitude: newPos.lng
            });
          }
        }
      }
    }),
    [setPosition, onMarkerDragEnd]
  );

  return (
    <Marker
      draggable={isDraggable}
      eventHandlers={eventHandlers}
      position={localPosition}
      ref={markerRef}
      icon={myIcon}
    >
      {showPopup && (
        <Popup minWidth={90}>
          Your position: {localPosition.lat}, {localPosition.lng}
        </Popup>
      )}
    </Marker>
  );
};

export default DraggableMarker;
