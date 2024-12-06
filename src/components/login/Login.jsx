import {toast} from "react-toastify";
// import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db }  from "../../lib/firebase";
import { doc, setDoc, getDocs } from "firebase/firestore";
import { useState } from "react";
import { collection, query, where,  } from "firebase/firestore";

const Login = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);
        try {
            setLoading(true);
            const res = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Вход успешно выполнен");
        }
        catch (error) {
            console.log(error)
            toast.error("Ошибка входа");
        }
        finally {
            setLoading(false);
        }

    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        // VALIDATE INPUTS
        if (!username || !email || !password)
            return toast.warn("Пожалуйста заполните все данные");

        // VALIDATE UNIQUE USERNAME
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return toast.warn("Пользователь с таким email уже существует");
        }

        try {
            setLoading(true);
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", res.user.uid), {
                username: username,
                email: email,
                id: res.user.uid,
            });
            toast.success("Register User");
        }
        catch (error) {
            console.log(error)
            toast.error("Ошибка регистрации");
        }
        finally {
            setLoading(false);
        }
    }

    return <div>
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
                <input type={"email"} name={"email"} minLength={5} placeholder="email"/>
                <input type={"password"} name={"password"} minLength={6} placeholder={"пароль"}/>
                <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
            </form>
        </div>
        <div>Separator</div>
        <div><h2>Sign Up</h2>
            <form onSubmit={handleRegister}>
                <input type={"text"} name={"username"} minLength={1} placeholder={"имя"}/>
                <input type={"email"} name={"email"} minLength={6} placeholder="email"/>
                <input type={"text"} name={"password"} minLength={6} placeholder={"пароль"}/>
                <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
            </form>
        </div>
    </div>
}

export default Login;