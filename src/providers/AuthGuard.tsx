import { createContext, useContext, useState } from 'react';
import GoogleLogin from 'react-google-login';

import type {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';

export type AuthGuardContext = {
  accessToken: string | null;
  signOut: () => void;
};

const AuthGuardContext = createContext<AuthGuardContext>(
  {} as AuthGuardContext,
);

export const useAuthGuardContext = (): AuthGuardContext =>
  useContext<AuthGuardContext>(AuthGuardContext);

type Props = {
  children: React.ReactNode;
};

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const signIn = (accessToken: string) => {
    setAccessToken(accessToken);
  };

  const signOut = () => {
    setAccessToken(null);
  };

  const responseGoogle = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    // TODO offline
    if ('code' in response) {
      console.log(response.code);
      return signOut();
    }

    signIn(response.accessToken);
  };

  const responseGoogleError = (response: unknown) => {
    console.warn(response);
  };

  if (!accessToken)
    return (
      <GoogleLogin
        clientId={import.meta.env.VITE_CLIENT_ID}
        onSuccess={responseGoogle}
        onFailure={responseGoogleError}
        scope="https://www.googleapis.com/auth/tasks"
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    );

  return (
    <AuthGuardContext.Provider value={{ accessToken, signOut }}>
      {children}
    </AuthGuardContext.Provider>
  );
};
