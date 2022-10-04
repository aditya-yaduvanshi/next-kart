import { USERS_URL } from "constants/urls";
import { User } from "firebase/auth";
import React, { createContext, PropsWithChildren, useCallback, useContext } from "react";
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from 'utils/firebase'

interface IAuthContext {
  user?: User | null;
  loading: boolean;
  error?: Error;
}

export const getHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': token,
  }
}

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
  return useContext(AuthContext) as IAuthContext;
}

const AuthProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [user, loading, error] = useAuthState(auth);

  const getUser = useCallback(async () => {
    try {
      await fetch(USERS_URL)
    } catch (err) {

    }
  }, []);

  return (
    <>
      <AuthContext.Provider value={{user, loading, error}}>
        {children}
      </AuthContext.Provider>
    </>
  )
}

export default React.memo(AuthProvider);
