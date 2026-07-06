const API = "http://localhost/AttendX/backend/api/auth";

export async function login(email, password) {

    const response = await fetch(`${API}/login.php`, {

        method: "POST",

        credentials: "include",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    return await response.json();

}

export async function logout() {

    const response = await fetch(`${API}/logout.php`, {

        method: "POST",

        credentials: "include"

    });

    return await response.json();

}

export async function currentUser() {

    const response = await fetch(`${API}/user.php`, {

        credentials: "include"

    });

    return await response.json();

}