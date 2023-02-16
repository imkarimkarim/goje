import { ipcRenderer } from "electron";
import { List } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SearchResultItem from "../../Components/Report/SearchResultItem.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/Report/SearchBox.jsx";

const Customers = ({ history }) => {
    const [allCustomers, setAllCustomers] = useState();
    const [search, setSearch] = useState(false);

    useEffect(() => {
        ipcRenderer.send("getAllCustomers");

        ipcRenderer.on("getAllCustomers", (event, dbCustomers) => {
            setAllCustomers(dbCustomers);
        });

        ipcRenderer.on("toggleHideInCustomerInput", () => {
            ipcRenderer.send("getAllCustomers");
        });

        // clean up
        return () => {
            ipcRenderer.removeAllListeners("getAllCustomers");
        };
    }, []);

    const handleToggle = (id) => {
        ipcRenderer.send("toggleHideInCustomerInput", id);
    };

    let resultsList;
    if (allCustomers && allCustomers.length > 0) {
        let tmpCustomers = allCustomers.sort((a, b) => a.name.localeCompare(b.name));
        if (search) {
            tmpCustomers = allCustomers.filter((c) => c.name.includes(search));
        }

        resultsList = tmpCustomers.map((customer) => {
            return (
                <div key={customer.customeId}>
                    <SearchResultItem
                        initChecked={customer.hideInCustomerInput === false || customer.hideInCustomerInput === undefined ? true : false}
                        itemTitle={customer.name}
                        customeId={customer.customeId}
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

export default Customers;
