import * as React from 'react';
import Typography from '@mui/material/Typography';
import SqlConnections from '../sql/sql-connections'

export default function SqlPage() {
  return <div><Typography>Welcome to the Toolpad SqlPage!</Typography>
    <br></br>
    <SqlConnections />
  </div>;
}