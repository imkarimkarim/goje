import { ipcRenderer } from "electron";
import { List } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SearchResultItem from "../../Components/Report/SearchResultItem.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/Report/SearchBox.jsx";

const ProductOwners = ({ history }) => {
    const [allProductOwners, setAllProductOwners] = useState();
    const [search, setSearch] = useState(false);

    useEffect(() => {
        ipcRenderer.send("getAllProductOwners");

        ipcRenderer.on("getAllProductOwners", (event, dbCustomers) => {
            setAllProductOwners(dbCustomers);
        });

        ipcRenderer.on("toggleHideInOwnersInput", () => {
            ipcRenderer.send("getAllProductOwners");
        });

        // clean up
        return () => {
            ipcRenderer.removeAllListeners("getAllProductOwners");
        };
    }, []);

    const handleToggle = (id) => {
        ipcRenderer.send("toggleHideInOwnersInput", id);
    };

    let resultsList;
    if (allProductOwners && allProductOwners.length > 0) {
        let tmpOwners = allProductOwners.sort((a, b) => a.name.localeCompare(b.name));
        if (search) {
            tmpOwners = allProductOwners.filter((c) => c.name.includes(search));
        }

        resultsList = tmpOwners.map((owner) => {
            return (
                <div key={owner.customeId}>
                    <SearchResultItem
                        initChecked={owner.hideInOwnersInput === false || owner.hideInOwnersInput === undefined ? true : false}
                        itemTitle={owner.name}
                        customeId={owner.customeId}
                        onChecked={(id) => {
                            handleToggle(id);
                        }}
                    />
                </div>
            );
        });
    }

    return (
        <div>
            <Nav history={history} />
            <SearchBox
                onSubmit={(newSearchState) => {
                    setSearch(newSearchState.text);
                }}
            />
            {resultsList ? <List>{resultsList}</List> : <></>}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
};

export default ProductOwners;
