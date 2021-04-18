import React, { useState } from "react";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import "./SearchResultItem.css";

const SearchResultItem = React.memo(
  ({ itemTitle, titleHint, customeId, onChecked, to }) => {
    const [checked, setChecked] = useState(false);

    return (
      <Link to={to}>
        <div className="SearchResultItem">
          <Divider />
          <ListItem button>
            <div>
              {itemTitle} <span className="hint"> {titleHint}</span>
            </div>
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
      </Link>
    );
  }
);

export default SearchResultItem;
