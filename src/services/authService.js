const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (response.ok) {
            const user = await response.json();
            return user;

        } else {
            const errorData = await response.json();
            return errorData;

        }

    } catch (error) {
        console.log(error)
    }
}

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

        if (response.ok) {

            const newUser = response.json();
            return newUser;

        } else {
            const errorData = await response.json();
            const messageError = errorData.body.error;
            return messageError;
        }

    } catch (error) {
        console.log(error)
    }
}