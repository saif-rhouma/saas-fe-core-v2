import { createContext } from 'react';

// ----------------------------------------------------------------------

export const PermissionContext = createContext(undefined);

export const PermissionConsumer = PermissionContext.Consumer;
