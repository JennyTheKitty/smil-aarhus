declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      SHADOW_DATABASE_URL: string;
      ROOT_DATABASE_URL: string;
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_SECRET: string;
      ADMIN_DEVSERVER_PORT: string | undefined;
      REFRESH_TOKEN_COOKIE_NAME: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
