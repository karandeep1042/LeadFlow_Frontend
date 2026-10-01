import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 260;

export const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileNavToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleMobileNavClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Persistent Responsive Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileNavClose} />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        }}
      >
        <Header onMobileNavToggle={handleMobileNavToggle} />

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          <Container maxWidth="xl" disableGutters>
            {children || <Outlet />}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
