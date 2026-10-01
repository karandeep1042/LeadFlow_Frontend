import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { ShieldCheck, Zap, Layers } from 'lucide-react';
import leadflowLogoWithoutLabel from '../../assets/leadflow-logo-without-label.png';

export const AuthLeftBanner = ({
  headline = 'Hello LeadFlow!',
  subtext = 'Skip repetitive and manual sales-marketing and document tasks. Get highly productive through German expat automation and save tons of time!',
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '100%',
        background: 'linear-gradient(145deg, #1b369c 0%, #1e40af 35%, #2563eb 85%, #3b82f6 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { xs: 4, md: 6, lg: 8 },
        color: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative Geometric Wireframe / Contour Lines (SVG Overlay) */}
      <Box
        component="svg"
        viewBox="0 0 800 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      >
        <path d="M 50,-100 L 750,200 L 650,850 L -50,550 Z" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M 120,-40 L 820,260 L 720,910 L 20,610 Z" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx="400" cy="500" r="320" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="400" cy="500" r="480" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
      </Box>

      {/* Top Brand Logo Icon */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            mb: 3,
            p: 1.25,
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
      </Box>

      {/* Center Hero Copy */}
      <Box sx={{ position: 'relative', zIndex: 2, my: 'auto', py: 4 }}>
        <Typography
          variant="h1"
          sx={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3.25rem', lg: '3.75rem' },
            letterSpacing: '-0.035em',
            lineHeight: 1.12,
            mb: 2.5,
          }}
        >
          {headline}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.88)',
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: 1.6,
            maxWidth: 480,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            mb: 4,
          }}
        >
          {subtext}
        </Typography>

        {/* Feature Badges */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.85,
              borderRadius: 2.5,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            <Layers size={15} />
            <span>Multi-Tenant CRM</span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.85,
              borderRadius: 2.5,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            <ShieldCheck size={15} />
            <span>German Expat Compliant</span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.85,
              borderRadius: 2.5,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            <Zap size={15} />
            <span>Auto Lead Ingestion</span>
          </Box>
        </Stack>
      </Box>

      {/* Bottom Copyright Footer */}
      <Box sx={{ position: 'relative', zIndex: 2, pt: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: '0.875rem',
            fontWeight: 400,
          }}
        >
          © 2026 LeadFlow. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLeftBanner;
