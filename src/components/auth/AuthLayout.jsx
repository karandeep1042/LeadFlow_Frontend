import React from 'react';
import { Box, Container, Paper, useTheme, useMediaQuery, Typography } from '@mui/material';
import AuthLeftBanner from './AuthLeftBanner';
import leadflowLogoWithoutLabel from '../../assets/leadflow-logo-without-label.png';

export const AuthLayout = ({
  children,
  headline = 'Hello LeadFlow!',
  subtext = 'Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    // Native Mobile App Experience
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Mobile Header Banner with Gradient */}
        <Box
          sx={{
            background: 'linear-gradient(145deg, #1b369c 0%, #1e40af 45%, #2563eb 100%)',
            pt: 4,
            pb: 6,
            px: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Decorative SVG Arc */}
          <Box
            component="svg"
            viewBox="0 0 400 200"
            fill="none"
            sx={{
              position: 'absolute',
              top: 0,
              right: -50,
              width: 300,
              height: 200,
              opacity: 0.15,
              pointerEvents: 'none',
            }}
          >
            <circle cx="200" cy="50" r="140" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.75,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={leadflowLogoWithoutLabel}
                alt="LeadFlow"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 800, letterSpacing: '-0.02em' }}>
              LeadFlow
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '1.65rem', mb: 0.5 }}>
            {headline}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem' }}>
            German expat mortgage pipeline & async verification.
          </Typography>
        </Box>

        {/* Mobile Sheet / App Card Container */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            mt: -3,
            pt: 3.5,
            pb: 5,
            px: { xs: 2.5, sm: 4 },
            boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Mobile Drag Indicator Bar */}
          <Box
            sx={{
              width: 44,
              height: 4,
              backgroundColor: '#e2e8f0',
              borderRadius: 2,
              mx: 'auto',
              mb: 3,
            }}
          />

          {children}

          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: '#94a3b8',
              mt: 'auto',
              pt: 4,
              fontSize: '0.75rem',
            }}
          >
            © 2026 LeadFlow GmbH • Secured with 256-Bit SSL
          </Typography>
        </Box>
      </Box>
    );
  }

  // Desktop / Tablet Split Screen Layout (Matches Image Exactly)
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        backgroundColor: '#ffffff',
        overflowX: 'hidden',
      }}
    >
      {/* Left 46% - Gradient Artwork & Branding */}
      <Box
        sx={{
          width: { md: '46%', lg: '44%', xl: '42%' },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          left: 0,
        }}
      >
        <AuthLeftBanner headline={headline} subtext={subtext} />
      </Box>

      {/* Right 54% - Clean White Form Area */}
      <Box
        sx={{
          flex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { md: 5, lg: 8, xl: 10 },
          backgroundColor: '#ffffff',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
