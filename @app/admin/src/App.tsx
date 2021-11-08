import { ApolloProvider, useApolloClient } from '@apollo/react-hooks';
import { useEffect, useState } from 'react';
import { LegacyDataProvider, Resource } from 'react-admin';

import apolloClient from './Apollo';
import AuthOnlyAdmin from './AuthOnlyAdmin';
import authProvider from './authProvider';
import { createDataProvider } from './dataProvider';
import eventCategories from './resources/eventCategories';
import events from './resources/events';
import eventTemplates from './resources/eventTemplates';
import groups from './resources/groups';
import members from './resources/members';

const ReactAdminWrapper = () => {
  const [dataProvider, setDataProvider] = useState<LegacyDataProvider | null>(
    null
  );
  const client = useApolloClient();

  useEffect(() => {
    (async () => {
      const dataProvider = await createDataProvider(client as any);
      setDataProvider(() => dataProvider);
    })();
  }, [client]);

  return (
    dataProvider && (
      <AuthOnlyAdmin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="Events" {...events} />
        <Resource name="EventCategories" {...eventCategories} />
        <Resource name="Members" {...members} />
        <Resource name="EventTemplates" {...eventTemplates} />
        <Resource name="Groups" {...groups} />
      </AuthOnlyAdmin>
    )
  );
};

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ReactAdminWrapper />
    </ApolloProvider>
  );
};

export default App;
