import React from 'react';
import RuoteEnum from '../config/routes';
import { Box, Typography } from '@mui/material';
import Strings from '../config/strings';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h1">
        404
      </Typography>
      <Typography variant="h6">
        {Strings.not_found_message}
      </Typography>
      <Link to={RuoteEnum.Dashboard}>{Strings.to_dashboard}</Link>
    </Box>
  );
};

export default NotFoundPage;