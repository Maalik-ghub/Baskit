import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from '../css/GeoSearch.module.css';
import { StringLiteral } from "typescript";
import { coordinates } from "@maptiler/sdk";

type LatLng = {lat: number, lng: number};

interface GeoSearchProps {
    query?: string;
    setCurrPos: React.Dispatch<React.SetStateAction<LatLng | null>>;
    setMapStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Place {
    properties: {
        name?: string;
        city?: string;
        county?: string;
        district?: string;
        postcode?: string;
        state?: string;
        country?: string;
    }
    geometry: {
        coordinates: [number, number];
    }
}

const NomatimSearch: React.FC<GeoSearchProps> = ({ query, setCurrPos, setMapStatus })  => {
    const [result, setResult] = useState<any>();

    function handleClick(index: number) {
        const lng = result[index].geometry.coordinates[0];
        const lat = result[index].geometry.coordinates[1];

        setCurrPos({lat: lat, lng: lng});
        setMapStatus(true);
    }

    useEffect(() => {
            const loadSearch = async () => {
        try {
            const res = await axios.post("/backend/geosearch/querysearch", {
            query: query
            });
            setResult(res.data.features);
        } catch (error) {
            console.error(error)
        }     
    }

        loadSearch();
    }, [query]);

    return (
        <div className={styles.nominatim}>
        <p className={styles.infoText}>Search results</p>
        {result?.map((item: Place, index: number) => {
            if(item.properties.name === undefined) item.properties.name = " ";
            if(item.properties.city === undefined) item.properties.city = " ";
            if(item.properties.county === undefined) item.properties.county = " ";
            if(item.properties.district === undefined) item.properties.district = " ";
            if(item.properties.postcode === undefined) item.properties.postcode = " ";
            return (
            <div className={styles.nominatimResult} key={index} onClick={() => {handleClick(index)}}>
                <div className={styles.h1}>
                    <p className={styles.locationMarker}></p>
                </div>
                <div className={styles.h2}>
                    <h3 className={styles.nominatimResultCounty}>{item.properties.name}</h3>
                    <p className={styles.nominatimResultDisplay}>{`${item.properties.city}
                                                               ${item.properties.county}
                                                               ${item.properties.district}
                                                               ${item.properties.postcode}
                                                               ${item.properties.state}
                                                               ${item.properties.country} `}</p>
                </div>
            </div>
        )})
        }
        </div>
    );
}

export default NomatimSearch;