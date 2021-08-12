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
    return onChecked ? (
      <div className="SearchResultItem">
        <Divider />
        <ListItem button>
          <Link to={to}>
            <div>
              {itemTitle} <span className="hint"> {titleHint}</span>
            </div>
          </Link>

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
          <ListItem button>
            <div>
              {itemTitle} <span className="hint"> {titleHint}</span>
            </div>
          </ListItem>
        </Link>
      </div>
    );
  }
);

export default SearchResultItem;
