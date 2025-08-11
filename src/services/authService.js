const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        return response;
    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });
        return response;
    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
    }
}

export const signout = async (token) => {
    try {
        const response = await fetch(`${API_URL}/signout`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        return response;

    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
    }
}