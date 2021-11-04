// ./AuthOnlyAdmin.js
// Use <AuthOnlyAdmin> instead of <Admin> to avoid flash-of-dashboard when checkAuth is not fulfilled.
// See: https://github.com/marmelab/react-admin/issues/5229
import { useEffect, useState } from "react";
import {
  AdminContext,
  AdminProps,
  AdminUI,
  AdminUIProps,
  useCheckAuth,
  useTimeout,
} from "react-admin";

const AuthOnlyAdminUI = (props: AdminUIProps) => {
  const checkAuth = useCheckAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const patience = useTimeout(500);

  useEffect(() => {
    checkAuth()
      .finally(() => {
        setAuthChecked(true);
      })
      .catch(() => {});
  }, [checkAuth, setAuthChecked]);

  if (authChecked) {
    return <AdminUI {...props} />;
  }

  if (patience) {
    const { loading: LoadingPage, theme } = props;
    // @ts-ignore
    return <LoadingPage theme={theme} />;
  }

  return null;
};

AuthOnlyAdminUI.defaultProps = AdminUI.defaultProps;

const AuthOnlyAdmin = (props: AdminProps) => {
  const {
    authProvider,
    dataProvider,
    i18nProvider,
    history,
    customReducers,
    customSagas,
    initialState,
    logoutButton,
    children,
    ...restProps
  } = props;
  return (
    <AdminContext
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      history={history}
      customReducers={customReducers}
      customSagas={customSagas}
      initialState={initialState}
    >
      <AuthOnlyAdminUI
        {...restProps}
        logout={authProvider ? logoutButton : undefined}
      >
        {children}
      </AuthOnlyAdminUI>
    </AdminContext>
  );
};

export default AuthOnlyAdmin;
