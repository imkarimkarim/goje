import React from 'react';
import {
  useParams
} from "react-router-dom";

export default function ShowFactro() {
  let { id } = useParams();
  return (
    <div>
    i will show factor {id}
    </div>
  )
}