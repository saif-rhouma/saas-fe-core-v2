// eslint-disable-next-line import/no-extraneous-dependencies
import io from 'socket.io-client';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';

import { CONFIG } from 'src/config-global';
import alarmFile from 'src//assets/sounds/alarm.mp3';
import notifyFile from 'src//assets/sounds/notif.mp3';
import { useGlobalContext } from 'src/context/context';

import { Logo } from 'src/components/logo';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

import { HeaderSection } from './header-section';
import { MenuButton } from '../components/menu-button';
import { SignInButton } from '../components/sign-in-button';
import { AccountDrawer } from '../components/account-drawer';
// import { SettingsButton } from '../components/settings-button';
import { LanguagePopover } from '../components/language-popover';
import { NotificationsDrawer } from '../components/notifications-drawer';
// ----------------------------------------------------------------------

const StyledDivider = styled('span')(({ theme }) => ({
  width: 1,
  height: 10,
  flexShrink: 0,
  display: 'none',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  marginLeft: theme.spacing(2.5),
  marginRight: theme.spacing(2.5),
  backgroundColor: 'currentColor',
  color: theme.vars.palette.divider,
  '&::before, &::after': {
    top: -5,
    width: 3,
    height: 3,
    content: '""',
    flexShrink: 0,
    borderRadius: '50%',
    position: 'absolute',
    backgroundColor: 'currentColor',
  },
  '&::after': { bottom: -5, top: 'auto' },
}));

// ----------------------------------------------------------------------

export function HeaderBase({
  sx,
  data,
  slots,
  slotProps,
  onOpenNav,
  layoutQuery,
  slotsDisplay: {
    signIn = true,
    account = true,
    settings = true,
    menuButton = true,
    localization = true,
    notifications = true,
  } = {},

  ...other
}) {
  const theme = useTheme();

  const { activePage } = useGlobalContext();

  const { user } = useAuthContext();

  const [socket, setSocket] = useState(null);

  const [events, setEvents] = useState([]);

  const notifyAlarm = ({ payload }) => {
    const audio = new Audio(alarmFile);
    audio.play();
    toast.warning(`${payload?.message}`);
  };

  const notify = ({ payload }) => {
    const audio = new Audio(notifyFile);
    audio.play();
    toast.warning(`${payload?.message}`);
  };

  useEffect(() => {
    const SERVER_EVENT_ENDPOINT = `${CONFIG.site.serverUrl}/api/notifications`;

    const newSocket = io(SERVER_EVENT_ENDPOINT, {
      auth: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    });

    setSocket(newSocket);
    if (newSocket) {
      newSocket.on('connect', () => {
        console.log(`---> User Connected Socket ID : ${newSocket.id}`);
      });

      newSocket.on('newNotification', (evt) => {
        if (evt.type === 'ALARM') {
          notifyAlarm(evt);
          setEvents((prevEvents) => [evt.payload, ...prevEvents]);
        }

        if (evt.type === 'HISTORY') {
          notify(evt);
          setEvents((prevEvents) => [
            ...evt.payload.data.map((item) => ({
              message: `Open Ticket: ${item.topic}`,
              type: 'HISTORY',
              data: item,
            })),
            ...prevEvents,
          ]);
        }

        if (evt.type === 'MESSAGE') {
          notify(evt);
        }
      });
    }

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <HeaderSection
      sx={sx}
      layoutQuery={layoutQuery}
      slots={{
        ...slots,
        leftAreaStart: slots?.leftAreaStart,
        leftArea: (
          <>
            {slots?.leftAreaStart}

            {/* -- Menu button -- */}
            {menuButton && (
              <MenuButton
                data-slot="menu-button"
                onClick={onOpenNav}
                sx={{
                  mr: 1,
                  ml: -1,
                  [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                }}
              />
            )}
            <Box>
              <Logo rounded displayName={false} width={30} height={30} />
            </Box>
            {/* -- Divider -- */}
            <StyledDivider data-slot="divider" />
            <span>{activePage}</span>
            {/* -- Workspace popover -- */}
            {/* {workspaces && <WorkspacesPopover data-slot="workspaces" data={data?.workspaces} />} */}

            {slots?.leftAreaEnd}
          </>
        ),
        rightArea: (
          <>
            {slots?.rightAreaStart}

            <Box
              data-area="right"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {/* -- Language popover -- */}
              {localization && <LanguagePopover data-slot="localization" data={data?.langs} />}
              {/* -- Notifications popover -- */}
              {notifications && <NotificationsDrawer data-slot="notifications" data={events} />}
              {/* -- Settings button -- */}
              {/* {settings && <SettingsButton data-slot="settings" />} */}
              {/* -- Account drawer -- */}
              {account && <AccountDrawer data-slot="account" data={data?.account} />}
              {/* -- Sign in button -- */}
              {signIn && <SignInButton />}
            </Box>

            {slots?.rightAreaEnd}
          </>
        ),
      }}
      slotProps={slotProps}
      {...other}
    />
  );
}
