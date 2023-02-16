/* eslint-disable react/display-name */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import "./SearchResultItem.css";

const SearchResultItem = React.memo(({ itemTitle, titleHint, customeId, onChecked, onClick, to, initChecked = false }) => {
    const [checked, setChecked] = useState(initChecked);
    return onChecked ? (
        <div className="SearchResultItem">
            <Divider />
            <ListItem
                onClick={() => {
                    onClick(customeId);
                }}
                button>
                {to ? (
                    <Link to={to}>
                        <div>
                            {itemTitle} <span className="hint"> {titleHint}</span>
                        </div>
                    </Link>
                ) : (
                    <div>
                        {itemTitle} <span className="hint"> {titleHint}</span>
                    </div>
                )}

                {onChecked ? (
                    <div>
                        <ListItemSecondaryAction>
                            <Checkbox
                                edge="end"
                                onChange={() => {
                                    setChecked(!checked);
                                    onChecked(customeId);
                                }}
                                checked={checked}
                            />
                        </ListItemSecondaryAction>
                    </div>
                ) : (
                    <span></span>
                )}
            </ListItem>
        </div>
    ) : (
        <div className="SearchResultItem">
            <Divider />
            <Link to={to}>
                <ListItem
                    onClick={() => {
                        onClick(customeId);
                    }}
                    button>
                    <div>
                        {itemTitle} <span className="hint"> {titleHint}</span>
                    </div>
                </ListItem>
            </Link>
        </div>
    );
});

export default SearchResultItem;
