import React, {useState, useRef, useEffect} from 'react';
import styles from './css/LocSelector.module.css';
import AddressItem from './ItemComponents/AddressItem';
import GeoSearch from './ItemComponents/GeoSearch';
import CurrentLocationButton from './ItemComponents/CurrentLocationButton';

type LatLng = {lat: number, lng: number};

interface savedaddress {
    id: number,
    selected?: boolean,
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
    type2contact: number | null;
}

interface LocSelectorProps {
    setLocStatus: React.Dispatch<React.SetStateAction<boolean>>;
    setMapStatus: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrPos: React.Dispatch<React.SetStateAction<LatLng | null>>;
    currPos: LatLng | null;
    savedAddresses: savedaddress[] | null;
    setSavedAddresses: React.Dispatch<React.SetStateAction<savedaddress[] | null>>;
}

const LocSelector: React.FC <LocSelectorProps> = ({ setLocStatus, setMapStatus, setCurrPos, currPos, savedAddresses, setSavedAddresses }) => {
    const [hiding, setHiding] = useState<boolean>(false);
    const [hasValue, setHasValue] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");

    function handleClick() {
       setHiding(true);
       setTimeout(()=> {
        setLocStatus(false);
       }, 600)
    }

    function setAddAddress() {
        if(currPos) {
            setMapStatus(true);
        } else if(!currPos) {
            window.navigator.geolocation.getCurrentPosition((position) => {
            setCurrPos({ lat: position.coords.latitude, lng: position.coords.longitude });
            setMapStatus(true)
        }, (error) => {
            console.error(error)
        }, {
            enableHighAccuracy: true,
            maximumAge: 0
        });
        }
        
    }

    const geoSearchRef = useRef<HTMLInputElement>(null);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const geoSearchInput = geoSearchRef.current;
        if(!geoSearchInput) return;

        const handleChange = () => {
            if(typingTimeout.current) clearTimeout(typingTimeout.current);
            setHasValue(true)
            typingTimeout.current = setTimeout(() => {
                setQuery(geoSearchInput.value);
                if(geoSearchInput.value === null || geoSearchInput.value === "" || geoSearchInput.value === " ") {
                  setHasValue(false);
                }
            }, 500)
        }

        geoSearchInput?.addEventListener("input", handleChange);

        return ()=> {
            geoSearchInput.removeEventListener("input", handleChange);
            if(typingTimeout.current) clearTimeout(typingTimeout.current);
        }

    }, [])

    return (
    <div className={`${styles.locMenu} ${hiding ? styles.hide : ''}`}>
        <div className={styles.v1}>
            <div className={styles.v1h1} onClick={handleClick}></div>
            <div className={styles.v1h2}>SELECT DELIVERY LOCATION</div>
            <div className={styles.v1h3}></div>
        </div>
        <div className={styles.v2}>
            <div className={styles.v2v1}>
                <button className={styles.v2v1h1}></button>
                <input ref={geoSearchRef} className={styles.v2v1h2} placeholder='Search for your location'></input>
            </div>
            {!hasValue && 
            <>
            <CurrentLocationButton setCurrPos={setCurrPos} setMapStatus={setMapStatus}/>
            <div className={styles.v2v3}>
                <p className={styles.v2v3h1}>Saved addresses</p>
                <p className={styles.v2v3h2h2} onClick={setAddAddress}><span></span> ADD ADDRESS</p>
            </div>
            <div className={styles.v2v4}>
                {savedAddresses?.map((item, index) => (
                    <AddressItem
                    key={index}
                    index={index}
                    selected={item.selected}
                    title={item.name}
                    location={item.flat.toUpperCase() + ", " + item.address}
                    setSavedAddresses={setSavedAddresses}
                    />
                ))}
                
            </div>
            </>
            }
            {hasValue && 
            <>
            <GeoSearch query={query} setCurrPos={setCurrPos} setMapStatus={setMapStatus} />
            </>
            }
        </div>
    </div>
    );
}

export default LocSelector;