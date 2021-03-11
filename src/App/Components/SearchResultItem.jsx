import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import './SearchResultItem.css';

const SearchResultItem = React.memo(({itemTitle, titleHint, customeId}) => {
  return(
    <>
      <Divider />
      <ListItem button>
          {itemTitle} <span className='grayHint'> {titleHint}</span>
      </ListItem>
    </>
  )
})

export default SearchResultItem;