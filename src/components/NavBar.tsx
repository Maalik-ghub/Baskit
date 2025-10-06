import React, { useEffect, useState } from 'react';
import style from './css/Navbar.module.css';
import axios from "axios";

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

interface NavBarProps {
    setLocStatus: React.Dispatch<React.SetStateAction<boolean>>;
    savedAddresses: savedaddress[] | null;
}

const NavBar: React.FC<NavBarProps> = ({ setLocStatus, savedAddresses }) => {
    const [location, setLocation] = useState<string>("Loading...");
    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition(async (position) => {
            const res = await axios.post("/backend/geosearch/reverse-search", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
            setLocation(res.data);
        }, (error) => {
            console.log(error);
        }, {
            enableHighAccuracy: true,   // try to use GPS instead of network
            timeout: 10000,             // how long to wait
            maximumAge: 0  
        })
    })

    return (
        <div className={style.navbar} >
            <div className={style.v1h1} onClick={() => setLocStatus(true)}>
                <p className={style.currLoc}><span className={style.currLocLabel}></span>Deliver to {savedAddresses? savedAddresses[0].name : "Location"} &nbsp; <br /><span>{location}</span></p>
            </div>
            <div className={style.v1h2}>
                <p className={style.logo}></p>
            </div>
        </div>
    )
}

export default NavBar;