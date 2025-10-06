// src/components/MapLibreView.tsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import L from "leaflet";
import "@maplibre/maplibre-gl-leaflet"; 
import defaultMarker from '../css/images/location-marker.png';
import userMarker from '../css/images/blue-dot.png';
import MarkerMoveWithMap from "./mapEvents/MarkerMoveWithMap";
import MapDetails from "./mapEvents/MapDetails";


type LatLng = { lat: number; lng: number };

interface savedaddress {
    id: number,
    selected?: boolean;
    type: number,
    lat: number,
    lng: number,
    address: string,
    name: string,
    flat: string,
    street: string | null,
    landmark: string | null,
    contact: number,
    type2name: string | null,
    type2contact: number | null
}

interface MapLibreViewProps {
  currPos: LatLng | null;
  zoom: number;
  marker?: LatLng | null;
  setCurrPos: React.Dispatch<React.SetStateAction<LatLng | null>>;
  setMapStatus: React.Dispatch<React.SetStateAction<boolean>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setSavedAddresses: React.Dispatch<React.SetStateAction<savedaddress[] | null>>;
}

const MapLibreTileLayer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const layer = L.maplibreGL({
    style: "https://api.maptiler.com/maps/basic-v2/style.json?key=cwnkSwLaOP2NIDCL3che",
    });
    layer.addTo(map);
    map.attributionControl.addAttribution(" ");
    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return null;
};

const MapLibreView: React.FC<MapLibreViewProps> = ({ 
  currPos,
  zoom, 
  marker, 
  setCurrPos, 
  setMapStatus, 
  isDragging, 
  setIsDragging,
  setSavedAddresses
 }) => {
  const [markerPos, setMarkerPos] = useState<LatLng | null>(marker? {lat: marker.lat, lng: marker.lng} : null);
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [addressStatus, setAddressStatus] = useState<boolean>(false);
  
    const customIcon = L.icon({
        iconUrl: defaultMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    })

    const userIcon = L.icon({
      iconUrl: userMarker,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })

  useEffect(() => {
    if(!navigator.geolocation) {
      console.error("Your browser or device does not support GPS");
      return;
    }

    const watchId = navigator.geolocation.watchPosition((position) => {
      const {latitude, longitude } = position.coords;
      setUserPos({ lat: latitude, lng: longitude });
    },(error) => {
      window.alert(error)
    }, {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000
    })

    return () => {
      navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <>
    {currPos &&
    <MapContainer
      center={[currPos.lat, currPos.lng]}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
     <MapLibreTileLayer/>
     <MarkerMoveWithMap setMarkerPos={setMarkerPos} setIsDragging={setIsDragging} setCurrPos={setCurrPos} addressStatus={addressStatus}/>
      {markerPos && (
        <Marker position={[markerPos.lat, markerPos.lng]}
                icon={customIcon} 
                draggable={false}
                ref={(marker) => {
                if (isDragging && marker) {
                  marker.openPopup(); // keep popup always open
                }
                if(!isDragging && marker) {
                  marker.closePopup();
                }
                }}
                >
          <Popup closeButton={false} autoClose={false} closeOnClick={false}>
            <div style={{
                color: "white",
                backgroundColor: "#1c1c1c",
                background: "#1c1c1c",
                padding: "0",
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: "500",
                maxWidth: 200,
                maxHeight: 150
            }}>Drag the pin to adjust</div>
          </Popup>
        </Marker>
      )}
    {userPos && 
    <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}/>
    }
    {userPos && isDragging && 
    <Circle center={[userPos.lat, userPos.lng]} radius={30}/>
    }
    <MapDetails 
    currPos={currPos}
    isDragging={isDragging} 
    addressStatus={addressStatus} 
    setAddressStatus={setAddressStatus} 
    setSavedAddresses={setSavedAddresses}
    setMapStatus={setMapStatus}
    />
    </MapContainer>
    }
    </>
  );
};

export default MapLibreView;