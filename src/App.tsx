import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import LocSelector from './components/LocSelector';
import MapSelector from './components/MapSelector';
import AlertBox from './components/AlertBox';
import axios from 'axios';

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

const App: React.FC = () => {
  const [locStatus, setLocStatus] = useState<boolean>(false);
  const [mapStatus, setMapStatus] = useState<boolean>(false);
  const [currPos, setCurrPos] = useState<LatLng | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [locationAccess, setLocationAccess] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<"iOS" | "Android" | "Other">("Android");
  const [deviceMode, setDeviceMode] = useState<"standalone" | "website">("website");
  const [savedAddresses, setSavedAddresses] = useState<savedaddress[] | null>(null);
  

  useEffect(() => {
    const ua = navigator.userAgent;

    if (/iPhone|iPad|iPod/i.test(ua)) {
      setDeviceType("iOS");
    } else if (/android/i.test(ua)) {
      setDeviceType("Android");
    } else {
      setDeviceType("Other");
    }

    window.navigator.geolocation.getCurrentPosition((position) => {
      setLocationAccess(true)
    }, (error)=> {
      console.log(error)
      setLocationAccess(false)
      setIsAlertOpen(true)
    })

    if(window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && window.navigator.standalone === true)) {
      setDeviceMode('standalone');
    } else {
      setDeviceMode('website');
    }

    setInterval(() => {
      if(!locationAccess && !isAlertOpen) {
        setIsAlertOpen(true);
      }
    }, 500)
  }, [])

  return (
    <>
      <div className="App">
        {locationAccess === false && deviceType === "Android" && isAlertOpen && <AlertBox 
                     titleMessage='Location Permission Needed'
                     descriptionMessage={`Please allow Location permissions for this site or Chrome`}
                     closeMessage='Okay'
                     setIsAlertOpen={setIsAlertOpen}
                    />}
        {locationAccess === false && deviceType === "iOS" && isAlertOpen && <AlertBox
                     titleMessage='Location Permission Needed'
                     descriptionMessage={`Please allow Location permissions for this site or Safari`}
                     closeMessage='Okay'
                     setIsAlertOpen={setIsAlertOpen}
        />}
        {deviceMode === "website" && 
        <>
        <NavBar setLocStatus={setLocStatus} savedAddresses={savedAddresses}/>
        {locStatus? <LocSelector 
                     setLocStatus={setLocStatus}
                     setMapStatus={setMapStatus}
                     setCurrPos={setCurrPos}
                     currPos={currPos}
                     savedAddresses={savedAddresses}
                     setSavedAddresses={setSavedAddresses}
                     /> : null}
        {mapStatus? <MapSelector 
                     setMapStatus={setMapStatus}
                     currPos={currPos}
                     setCurrPos={setCurrPos}
                     setSavedAddresses={setSavedAddresses}
                     /> : null}
        </>
        }
      </div>
    </>
  )
}

export default App;
