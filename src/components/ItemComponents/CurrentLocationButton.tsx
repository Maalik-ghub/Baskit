import React from "react";
import styles from "../css/LocSelector.module.css";

type LatLng = { lat: number; lng: number };

interface CurrentLocationButtonProps {
  setCurrPos: React.Dispatch<React.SetStateAction<LatLng | null>>;
  setMapStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({setCurrPos, setMapStatus}) => {

  const handleClick = () => {
    window.navigator.geolocation.getCurrentPosition((position) => {
        setCurrPos({lat: position.coords.latitude, lng: position.coords.longitude});
        setMapStatus(true);
    }, (error) => {
        console.log("error occured", error)
    }, {
      enableHighAccuracy: true,   // try to use GPS instead of network
      timeout: 10000,             // how long to wait
      maximumAge: 0 
    }) 
  };  

  return (
    <div className={styles.v2v2} onClick={handleClick}>
      <span className={styles.v2v2h1}></span>
      <p className={styles.v2v2h2}>Use current location</p>
    </div>
  );
};

export default CurrentLocationButton;
