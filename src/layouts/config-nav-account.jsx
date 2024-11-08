import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// export const _account = [
//   {
//     label: 'Dashboard Home',
//     href: '/dashboard',
//     icon: <Iconify icon="solar:home-angle-bold-duotone" />,
//   },
//   {
//     label: 'Account Setting',
//     href: '/dashboard/tools/account-setting',
//     icon: <Iconify icon="solar:settings-bold-duotone" />,
//   },
// ];

export const _account = (accountSetting) => {
  if (!accountSetting) {
    return [
      {
        label: 'Dashboard Home',
        href: '/dashboard',
        icon: <Iconify icon="solar:home-angle-bold-duotone" />,
      },
    ];
  }
  return [
    {
      label: 'Dashboard Home',
      href: '/dashboard',
      icon: <Iconify icon="solar:home-angle-bold-duotone" />,
    },
    {
      label: 'Account Setting',
      href: '/dashboard/tools/account-setting',
      icon: <Iconify icon="solar:settings-bold-duotone" />,
    },
  ];
};
