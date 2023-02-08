declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string,
      SPOTIFY_CLIENT_ID: string,
      SPOTIFY_CLIENT_SECRET: string,
      REDIRECT_URI: string,
      CLIENT_REDIRECT_URI: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};