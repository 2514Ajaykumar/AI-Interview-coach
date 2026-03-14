"use client";

import { useEffect, useState } from "react";

export default function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiry = payload.exp * 1000;

            if (Date.now() > expiry) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } else {
                setUser(payload);
            }
        } catch (err) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        }

        setLoading(false);
    }, []);

    return { user, loading };
}