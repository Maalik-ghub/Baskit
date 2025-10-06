import React from 'react';
import styles from '../css/LocSelector.module.css';

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

interface addressItemProps {
    index: number;
    title?: string;
    location?: string;
    selected?: boolean;
    setSavedAddresses: React.Dispatch<React.SetStateAction<savedaddress[] | null>>;
}

const AddressItem: React.FC <addressItemProps> = ({ index, title, location, selected, setSavedAddresses }) => {
    
    function setAddress() {
        setSavedAddresses((prev) => {
            if(prev) {
                const currentAddress = prev.find((a) => a.id === index);
                if(!currentAddress) return prev

                const updatedAddress = prev.filter((a) => a.id !== index).map((item, i) => ({
                    ...item,
                    id: i + 1,
                    selected: false
                }))

                return [{...currentAddress, id: 0, selected: true}, ...updatedAddress];
            } else {
                return null;
            }
        })
    }
    
    return(
        <div className={styles.v2v4Item} onClick={() => setAddress()}>
                    <div className={styles.v2v4Itemh1}>
                        <span></span>
                    </div>
                    <div className={styles.v2v4Itemh2}>
                        <div className={styles.titleWrapper}>
                            <span className={styles.v2v4Itemh2v1}>{title?.charAt(0).toUpperCase() + "" + title?.slice(1).toLowerCase()}</span>
                            {selected && 
                            <span className={styles.selected}>SELECTED</span>
                            }
                        </div> 
                        <p className={styles.v2v4Itemh2v2}>{location}</p>
                    </div>
                    <div className={styles.v2v4Itemh3}>
                        <button className={styles.v2v4Itemh3v1}></button>
                    </div>
                </div>
    )
}

export default AddressItem;