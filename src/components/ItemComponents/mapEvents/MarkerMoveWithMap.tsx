import React from 'react';
import { useMapEvents } from 'react-leaflet';

type LatLng = {lat: number, lng: number};

interface MarkerMoveWithMapProps {
    setMarkerPos: React.Dispatch<React.SetStateAction<LatLng | null>>;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrPos: React.Dispatch<React.SetStateAction<LatLng | null>>;
    addressStatus: boolean;
}

const MarkerMoveWithMap: React.FC<MarkerMoveWithMapProps> = ({ setMarkerPos, setIsDragging, setCurrPos, addressStatus }) => {
  useMapEvents({
    move: (e) => {
      if(addressStatus) return;
      setMarkerPos({lat: e.target.getCenter().lat, lng: e.target.getCenter().lng })
      setIsDragging(false)
    },
    dragend: (e) => {
      if(addressStatus) return;
      setCurrPos({lat: e.target.getCenter().lat, lng: e.target.getCenter().lng });
      setIsDragging(true);
    },
    zoomend: (e) => {
      if(addressStatus) return;
      setIsDragging(true)
    }
  })
  return null
}

export default MarkerMoveWithMap;