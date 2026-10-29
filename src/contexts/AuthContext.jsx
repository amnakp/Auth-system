import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  checkUsernameExists,
  createUser,
  getUserByEmail,
  getUserById,
} from "../services/authApi";

const STORAGE_KEY = "userId";
const SERVER_ERROR =
  "Could not reach the server. Make sure JSON Server is running.";

const AuthContext = createContext(null);

// Never keep the password in React state.
function withoutPassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Starts true because we check for a saved session when the app opens.
  const [isLoading, setIsLoading] = useState(true);

  // Refresh: read user.id from localStorage and fetch the profile.
  const fetchCurrentUser = useCallback(async () => {
    const userId = localStorage.getItem(STORAGE_KEY);

    if (!userId) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);

    try {
      const data = await getUserById(userId);
      const safeUser = withoutPassword(data);
      setUser(safeUser);
      return safeUser;
    } catch {
      // Bad or deleted id: clear the session.
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Returns true if the username is already taken.
  const checkUsername = useCallback(async (username) => {
    try {
      return await checkUsernameExists(username);
    } catch {
      throw new Error(SERVER_ERROR);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    let foundUser;

    try {
      foundUser = await getUserByEmail(email);
    } catch {
      throw new Error(SERVER_ERROR);
    }

    if (!foundUser || foundUser.password !== password) {
      throw new Error("Invalid email or password.");
    }

    localStorage.setItem(STORAGE_KEY, String(foundUser.id));
    setUser(withoutPassword(foundUser));
  }, []);

  const register = useCallback(async (userData) => {
    try {
      if (await checkUsernameExists(userData.username)) {
        throw new Error("That username is already taken.");
      }

      if (await getUserByEmail(userData.email)) {
        throw new Error("An account with that email already exists.");
      }

      return withoutPassword(await createUser(userData));
    } catch (err) {
      // Keep our own messages, replace network errors.
      if (
        err.message === "That username is already taken." ||
        err.message === "An account with that email already exists."
      ) {
        throw err;
      }
      throw new Error(SERVER_ERROR);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  // Protected routes check that user.id exists in localStorage.
  const isAuthenticated = useCallback(
    () => Boolean(localStorage.getItem(STORAGE_KEY)),
    []
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated,
      fetchCurrentUser,
      checkUsername,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated,
      fetchCurrentUser,
      checkUsername,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}