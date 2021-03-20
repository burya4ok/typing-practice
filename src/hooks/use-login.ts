import Services from "../services";
import { navigate } from "@reach/router";
import { useContext, useEffect, useCallback } from "react";
import { LogedInActionType, LogedInUser } from "../providers/loged-in-user";
import type { User } from "../entities/user";
import { Client } from "../entities/client";
import { Role } from "../entities/role";

export type Credentials = {
  email: string;
  password: string;
};

export default function useLogin(credentials: Credentials | null): User | null {
  const { loginService } = useContext(Services);
  const { dispatch, state = { user: null } } = useContext(LogedInUser);

  useEffect(() => {
    if (!credentials || !dispatch) {
      return;
    }

    loginService
      .login(credentials.email, credentials.password)
      .then((user: User) => dispatch!({ type: LogedInActionType.LOG_IN, payload: user }))
      .catch((e) => alert(e.message));
  }, [credentials, dispatch, loginService]);

  useEffect(() => {
    if (state.user) {
      switch (state.user.role) {
        case Role.ADMIN:
        case Role.MODERATOR: {
          navigate("/");
          break;
        }
        default: {
          alert(`${state.user.email} with role: ${state.user.role} doesn't have access to the dashboard`);
        }
      }
    }
  }, [state.user]);

  return state.user;
}
