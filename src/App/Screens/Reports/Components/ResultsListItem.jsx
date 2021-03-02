import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import './ResultsListItem.css';

export default function ResultsListItem({productName, owner, customeId}) {
  return(
    <>
      <Divider />
      <ListItem button>
          {`${productName} ${owner}`} <span className='grayHint'>{customeId}</span>
      </ListItem>
    </>
  )
}