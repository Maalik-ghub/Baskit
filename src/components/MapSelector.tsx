import React, {useState} from 'react';
import styles from './css/MapSelector.module.css';
import MapLibreView from './ItemComponents/MapComponent';
import MapDetails from './ItemComponents/mapEvents/MapDetails';

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

interface MapSelectorProps {
    setMapStatus: React.Dispatch<React.SetStateAction<boolean>>;
    currPos: LatLng | null;
    setCurrPos: React.Dispatch<React.SetStateAction<LatLng | null>>;
    setSavedAddresses: React.Dispatch<React.SetStateAction<savedaddress[] | null>>;
}

const MapSelector: React.FC<MapSelectorProps> = ({ setMapStatus, currPos, setCurrPos, setSavedAddresses }) => {
    const [hiding, setHiding] = useState<boolean>(false);
    const [zoom, setZoom] = useState<number>(17);
    const [isDragging, setIsDragging] = useState<boolean>(true);

    async function handleClick() {
       setHiding(true);
       setTimeout(()=> {
        setMapStatus(false);
       }, 600)
    }
    return(
        <div className={`${styles.mapMenu} ${hiding ? styles.hide : ''}`}>
            <div className={styles.v1}>
                <div className={styles.v1h1} onClick={handleClick}></div>
                <div className={styles.v1h2}>SELECT DELIVERY LOCATION</div>
                <div className={styles.v1h3}></div>
            </div>
            <div className={styles.v2}>
                <MapLibreView currPos={currPos}
                              zoom={zoom}
                              marker={currPos || undefined}
                              setCurrPos={setCurrPos}
                              setMapStatus={setMapStatus}
                              isDragging={isDragging}
                              setIsDragging={setIsDragging}
                              setSavedAddresses={setSavedAddresses}
                              />
            </div>
        </div>
    );
}

export default MapSelector;