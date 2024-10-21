import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { varAlpha, bgGradient } from 'src/theme/styles';

// ----------------------------------------------------------------------

export function Section({
  sx,
  method,
  layoutQuery,
  methods,
  title = 'Manage the job',
  imgUrl = `${CONFIG.site.basePath}/assets/illustrations/illustration-dashboard.webp`,
  subtitle = 'More effectively with optimized workflows.',

  ...other
}) {
  const theme = useTheme();

  return (
    <Stack flexGrow={1} spacing={10} alignItems="center" justifyContent="center">
      <Box
        sx={{
          ...bgGradient({
            color: `0deg, ${varAlpha(
              theme.vars.palette.background.defaultChannel,
              0.92
            )}, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)}`,
            imgUrl: `${CONFIG.site.basePath}/assets/background/background-3-blur.webp`,
          }),
          px: 3,
          pb: 3,
          width: 1,
          height: 1,
          display: 'none',
          position: 'relative',
          pt: 'var(--layout-header-desktop-height)',
          [theme.breakpoints.up(layoutQuery)]: {
            gap: 8,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          },
          ...sx,
        }}
        {...other}
      >
        <div>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
              {subtitle}
            </Typography>
          )}
        </div>

        <Box
          component="img"
          alt="Dashboard illustration"
          src={imgUrl}
          sx={{
            width: 1,
            aspectRatio: '4/3',
            objectFit: 'cover',
            maxWidth: {
              xs: 480,
              lg: 560,
              xl: 720,
            },
          }}
        />

        {!!methods?.length && method && (
          <Box component="ul" gap={2} display="flex">
            {methods.map((option) => {
              const selected = method === option.label.toLowerCase();

              return (
                <Box
                  key={option.label}
                  component="li"
                  sx={{
                    ...(!selected && {
                      cursor: 'not-allowed',
                      filter: 'grayscale(1)',
                    }),
                  }}
                >
                  <Tooltip title={option.label} placement="top">
                    <Link
                      component={RouterLink}
                      href={option.path}
                      sx={{
                        ...(!selected && { pointerEvents: 'none' }),
                      }}
                    >
                      <Box
                        component="img"
                        alt={option.label}
                        src={option.icon}
                        sx={{ width: 32, height: 32 }}
                      />
                    </Link>
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Stack>
  );
}
