import React, {useEffect, useState, useRef} from 'react';
import styles from '../../css/MapDetails.module.css';
import axios from "axios";
import * as turf from '@turf/turf';


type LatLng = {lat: number, lng: number};

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

interface MapDetailsProps {
    currPos?: LatLng | null;
    markerPos?: LatLng | null;
    isDragging?: boolean;
    addressStatus?: boolean;
    setAddressStatus: React.Dispatch<React.SetStateAction<boolean>>;
    setSavedAddresses: React.Dispatch<React.SetStateAction<savedaddress[] | null>>;
    setMapStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapDetails: React.FC<MapDetailsProps> = ({ currPos, markerPos, isDragging, addressStatus, setAddressStatus, setSavedAddresses, setMapStatus }) => {
    const [detailsName, setDetailsName] = useState<string>("");
    const [detailsDescription, setDetailsDescription] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [person, setPerson] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [cityError, setCityError] = useState<boolean>(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const flatRef = useRef<HTMLInputElement>(null);
    const streetRef = useRef<HTMLInputElement>(null);
    const landmarkRef = useRef<HTMLInputElement>(null);
    const contactRef = useRef<HTMLInputElement>(null);
    const type2nameRef = useRef<HTMLInputElement>(null);
    const type2contactRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if(isDragging && currPos) {
        const ponnaniPolygon = turf.polygon([[ 
            [75.936, 10.74],
            [75.96, 10.698],
            [75.977, 10.672],
            [76.004, 10.671],
            [76.039, 10.688],
            [76.045, 10.733],
            [76.032, 10.734],
            [76.011, 10.786],
            [75.95, 10.791],
            [75.911, 10.785],
            [75.936, 10.74]
            ]]);
        const cityPolygons = [
            {name: "Ponnani", polygon: ponnaniPolygon}
        ]
        const point = turf.point([currPos.lng, currPos.lat]);
        const matchedCity = cityPolygons.find(c => turf.booleanPointInPolygon(point, c.polygon));
        if(!matchedCity) {
            setCityError(true)
            setDetailsName("Unavaiable Location")
            setDetailsDescription("We are sorry, we are unavailable there.")
            return;
        }
        setCityError(false);
         const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await axios.post("/backend/geosearch/reverse-search", {
                    latitude: currPos.lat,
                    longitude: currPos.lng
            })
            if(result) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 300)
            }
            let data = `${result.data}`;
            let nameIndex = `${result.data}`.indexOf(",");
            let postCodeIndex = `${result.data}`.lastIndexOf(",");
            let conCatData = data.substring(0, nameIndex).toUpperCase();
            let restData = data.slice(nameIndex + 1, postCodeIndex).toLowerCase() + data.slice(postCodeIndex + 1).trim();
            setDetailsName(conCatData);
            setDetailsDescription(restData);
            } catch(error) {
                console.log(error);
            }
        }
        fetchData();
      }
    }, [currPos])

    function setLocation() {
        console.log(cityError)
        if(!cityError) {
            setAddressStatus(true);
        }
        
    }

    function addAddress() {
        let newAddress: savedaddress;
        if(!currPos) return console.log("didnt submit cus currpos not found");
        const nameValue = nameRef.current?.value.trim() || "Nabeel";
        if(!nameValue) return console.log("didnt submit cus name value not fouund");
        const flatValue = flatRef.current?.value.trim();
        if(!flatValue) return console.log("didnt submit cus flat value not fouund");
        const streetValue = streetRef.current?.value.trim() || null;
        const landmarkValue = landmarkRef.current?.value.trim() || null;
        const contactValue = Number(contactRef.current?.value.trim()) || 8317489279;
        if(!contactValue || isNaN(contactValue)) return console.log("didnt submit cus contact value not fouund");
        const type2nameValue = type2nameRef.current?.value.trim();
        const type2contactValue = Number(type2contactRef.current?.value.trim());

        if(person === 0) {
            newAddress = {
            id: 0,
            selected: true,
            type: person,
            lat: currPos.lat,
            lng: currPos.lng,
            address: detailsName,
            name: nameValue,
            flat: flatValue,
            street: streetValue,
            landmark: landmarkValue,
            contact: type2contactValue,
            type2name: null,
            type2contact: null
        } 
        setSavedAddresses((prev) => {
            if(prev) {
                if(prev.length >= 4) {
                    console.log("more than 4 already")
                    return prev
                }
                const updated = prev.map((item, i) => ({
                    ...item,
                    id: i + 1,
                    selected: false,
                }))
                return [newAddress, ...updated]
            } else {
                return [newAddress]
            }
        })
        setMapStatus(false);
      } else {
         if(!type2nameValue) return console.log("didnt submit cus type2 name value not fouund");
         if(!type2contactValue || isNaN(type2contactValue)) return console.log("didnt submit cus type2 contact value not fouund");
         newAddress = {
            id: 0,
            selected: true,
            type: person,
            lat: currPos.lat,
            lng: currPos.lng,
            address: detailsName,
            name: type2nameValue,
            flat: flatValue,
            street: streetValue,
            landmark: landmarkValue,
            contact: type2contactValue,
            type2name: nameValue,
            type2contact: contactValue
        } 
        setSavedAddresses((prev) => {
            if(prev) {
                const updated = prev.map((item, i) => ({
                    ...item,
                    id: i + 1,
                    selected: false,
                }))
                return [newAddress, ...updated]
            } else {
                return [newAddress]
            }
        })
        setMapStatus(false)
      }
    }

    return(
        <>
        {isDragging &&
        <div 
        className={!addressStatus? styles.container : `${styles.container} ${styles.resize}`}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        >
            {!addressStatus?
            <>
            <div className={styles.v1}>
                <div className={styles.v1h1}></div>
                <div className={styles.v1h2}>
                    <div className={styles.v1h2v1}>
                        {!isLoading? detailsName : "LOADING..."}
                    </div>
                    <div className={styles.v1h2v2}>
                        {!isLoading ? detailsDescription : "Kindly wait..."}
                    </div>
                </div>
            </div>
            <div className={styles.v2}>
                {
                <button className={!isLoading && !cityError?
                    styles.setLocation : `${styles.setLocation} ${styles.disabled}`
                } onClick={() => setLocation()}>Set Location</button>
                }
            </div>
            </> 
            : 
            <>
            <h1 className={styles.v3}>Add your address details</h1>
            <div className={styles.v4}>
                <p className={styles.v4head}>Who are you ordering for?</p>
                <button onClick={() => setPerson(0)} className={person === 0? `${styles.person} ${styles.active1}` : styles.person}></button>
                <span className={styles.personlabel}>Myself</span>
                <button onClick={() => setPerson(1)} className={person === 1? `${styles.person} ${styles.active2}` : styles.person}></button>
                <span className={styles.personlabel}>Someone else</span>
            </div>
            <div className={styles.v5}>
                  <p className={styles.v5head}>Address details</p>
                  <div className={styles.currentlocation}>
                    <div className={styles.currentlocationname}>{detailsName}</div>
                    <div className={styles.currentlocationdetails}>{detailsDescription}</div>
                  </div>
                    <input type="text" ref={flatRef}  className={styles.inputs} placeholder="Flat / House number"></input>
                    <input type="text" ref={streetRef} className={styles.inputs} placeholder="Street / Building name (optional)"></input>
                    <input type="text" ref={landmarkRef} className={styles.inputs} placeholder="Landmark (optional)"></input>
            </div>
            <div className={styles.v6}>
                {person === 0 && 
                <>
                <p className={styles.v6head}>Contact details</p>
                {isEditing? 
                <>
                <input type="text" className={styles.inputs} ref={nameRef} placeholder="Name" defaultValue="Nabeel Latheef"></input>
                <input type="text" className={styles.inputs} ref={contactRef} placeholder="Contact Number" defaultValue="+918317489279"></input>
                </> 
                : 
                <div className={styles.contactcontainer}>
                <div className={styles.contactdetailswrapper}>
                    <div className={styles.contactdetailsname}>Nabeel Latheef</div>
                    <div className={styles.contactdetailsnumber}>+918317489279</div>
                </div>
                <div className={styles.contactdetailseditorwrapper}>
                    <div className={styles.contactdetailseditor} onClick={() => setIsEditing(true)}></div>
                </div>
                </div>
                }
                </>}
                {person === 1 && 
                <>
                <p className={styles.v6head}>Reciever details</p>
                <input type="text" ref={type2nameRef} className={styles.inputs} placeholder="Reciever's Name"></input>
                <input type="text" ref={type2contactRef} className={styles.inputs} placeholder="Reciever's Contact Number"></input>
                </>}
            </div>
            <div className={styles.v7}>
                <button className={styles.submit} onClick={() => addAddress()}>Add Address</button>
            </div>
            </>
            }
        </div>} 
        </>
    )
}

export default MapDetails;