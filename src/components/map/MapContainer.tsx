import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import DraggableMarker from './DraggableMarker';
import './MapContainer.scss';
import UpdateMapCenter from './UpdateMapCenter';

interface IMapContainer {
  showMarkerPopup?: boolean;
  positionState: {
    position: {
      latitude: number | any;
      longitude: number | any;
    };
    setPosition: React.Dispatch<
      React.SetStateAction<{
        latitude: number | any;
        longitude: number | any;
      }>
    >;
  };
  tempPositionState: {
    tempPosition: {
      latitude: any;
      longitude: any;
    };
    setTempPosition: React.Dispatch<
      React.SetStateAction<{
        latitude: number | any;
        longitude: number | any;
      }>
    >;
  };
}

const MapWrapper = ({ positionState, tempPositionState, showMarkerPopup = false }: IMapContainer) => {
  const { position, setPosition } = positionState;
  const { tempPosition, setTempPosition } = tempPositionState;

  const updateInputValue = () => {
    setTempPosition({
      latitude: parseFloat(position.latitude),
      longitude: parseFloat(position.longitude)
    });
  };

  const handleMarkerDragEnd = (newPosition: any) => {
    // Update the marker position
    setPosition(newPosition);
    // Update the tempPosition for the input fields
    setTempPosition({
      latitude: newPosition.latitude,
      longitude: newPosition.longitude
    });
  };

  return (
    <>
      <MapContainer
        className='ds-block m-auto'
        style={{ height: '400px', width: '700px' }}
        center={[tempPosition.latitude, tempPosition.longitude]}
        zoom={7}
        scrollWheelZoom={false}
      >
        <UpdateMapCenter center={[tempPosition.latitude, tempPosition.longitude]} />
        <TileLayer attribution='' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <DraggableMarker
          isDraggable={true}
          onChange={updateInputValue}
          position={position}
          showPopup={showMarkerPopup}
          setPosition={setPosition}
          onMarkerDragEnd={handleMarkerDragEnd}
        />
      </MapContainer>
    </>
  );
};

export default MapWrapper;
