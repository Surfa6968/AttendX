import { createContext, useContext, useEffect, useState } from "react";
import {
    login as loginService,
    logout as logoutService,
    currentUser
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check session on application start
    useEffect(() => {

        async function checkAuth() {

            try {

                const response = await currentUser();

                if (response.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }

            } catch (error) {

                console.error("Authentication check failed:", error);
                setUser(null);

            } finally {

                setLoading(false);

            }

        }

        checkAuth();

    }, []);

    // Login
    const login = async (email, password) => {

        try {

            const response = await loginService(email, password);

            if (response.success) {

                setUser(response.data.user);

            }

            return response;

        } catch (error) {

            console.error(error);

            return {
                success: false,
                message: "Unable to connect to server."
            };

        }

    };

    // Logout
    const logout = async () => {

        try {

            await logoutService();

        } catch (error) {

            console.error(error);

        }

        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}