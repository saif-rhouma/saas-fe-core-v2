import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    topProducts: `${ROOTS.DASHBOARD}/top-products`,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    quotation: {
      root: `${ROOTS.DASHBOARD}/quotation`,
      new: `${ROOTS.DASHBOARD}/quotation/new`,
      details: (id) => `${ROOTS.DASHBOARD}/quotation/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/quotation/${id}/edit`,
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      status: `${ROOTS.DASHBOARD}/order-status`,
      new: `${ROOTS.DASHBOARD}/order/new`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/order/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/order/${MOCK_ID}/edit`,
      },
    },
    plan: {
      root: `${ROOTS.DASHBOARD}/plan`,
      status: `${ROOTS.DASHBOARD}/plan-status`,
      new: `${ROOTS.DASHBOARD}/plan/new`,
      details: (id) => `${ROOTS.DASHBOARD}/plan/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/plan/${id}/edit`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      addons: `${ROOTS.DASHBOARD}/product/addons`,
      categories: `${ROOTS.DASHBOARD}/product/categories`,
      stock: `${ROOTS.DASHBOARD}/product/stock`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      categoryDetails: (id) => `${ROOTS.DASHBOARD}/product/categories/details/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    customers: {
      root: `${ROOTS.DASHBOARD}/customer`,
      details: (id) => `${ROOTS.DASHBOARD}/customer/${id}`,
      // new: `${ROOTS.DASHBOARD}/plan/new`,
      // edit: (id) => `${ROOTS.DASHBOARD}/plan/${id}/edit`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/plan/${MOCK_ID}`,
      //   edit: `${ROOTS.DASHBOARD}/plan/${MOCK_ID}/edit`,
      // },
    },
    payments: {
      root: `${ROOTS.DASHBOARD}/payments`,
      // new: `${ROOTS.DASHBOARD}/plan/new`,
      // details: (id) => `${ROOTS.DASHBOARD}/plan/${id}`,
      // edit: (id) => `${ROOTS.DASHBOARD}/plan/${id}/edit`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/plan/${MOCK_ID}`,
      //   edit: `${ROOTS.DASHBOARD}/plan/${MOCK_ID}/edit`,
      // },
    },
    reminders: {
      root: `${ROOTS.DASHBOARD}/reminders`,
      // edit: (id) => `${ROOTS.DASHBOARD}/reminders/${id}/edit`,
      // new: `${ROOTS.DASHBOARD}/plan/new`,
      // details: (id) => `${ROOTS.DASHBOARD}/plan/${id}`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/plan/${MOCK_ID}`,
      //   edit: `${ROOTS.DASHBOARD}/plan/${MOCK_ID}/edit`,
      // },
    },
    tickets: {
      root: `${ROOTS.DASHBOARD}/tickets`,
      // new: `${ROOTS.DASHBOARD}/plan/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tickets/${id}`,
      // edit: (id) => `${ROOTS.DASHBOARD}/plan/${id}/edit`,
      // demo: {
      //   details: `${ROOTS.DASHBOARD}/plan/${MOCK_ID}`,
      //   edit: `${ROOTS.DASHBOARD}/plan/${MOCK_ID}/edit`,
      // },
    },
    staff: {
      root: `${ROOTS.DASHBOARD}/staff`,
      new: `${ROOTS.DASHBOARD}/staff/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/staff/${id}/edit`,
    },
    reports: {
      root: `${ROOTS.DASHBOARD}/reports`,
      daily: `${ROOTS.DASHBOARD}/reports/daily`,
      order: `${ROOTS.DASHBOARD}/reports/order`,
      plan: `${ROOTS.DASHBOARD}/reports/plan`,
      stock: `${ROOTS.DASHBOARD}/reports/stock`,
      custom: `${ROOTS.DASHBOARD}/reports/custom`,
    },
    tools: {
      root: `${ROOTS.DASHBOARD}/tools`,
      financial: `${ROOTS.DASHBOARD}/tools/financial-year`,
      master: `${ROOTS.DASHBOARD}/tools/master-setting`,
      permissions: `${ROOTS.DASHBOARD}/tools/permissions-groups`,
      newPermissions: `${ROOTS.DASHBOARD}/tools/permissions-groups/new`,
      detailsPermissions: (id) => `${ROOTS.DASHBOARD}/tools/permissions-groups/${id}`,
      editPermissions: (id) => `${ROOTS.DASHBOARD}/tools/permissions-groups/${id}/edit`,
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },

    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
