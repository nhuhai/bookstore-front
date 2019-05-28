import React from 'react';

export const CurrentInvoiceContext = React.createContext({
  currentInvoice: {},
  onAddNewRowToSubInvoice: () => {},
});
