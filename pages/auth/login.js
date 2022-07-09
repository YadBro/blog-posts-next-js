import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Router from "next/router";
import { unauthPage } from "../../middlewares/unauthorization";
import Link from "next/link";

export async function getServerSideProps(ctx) {
    await unauthPage(ctx);

    return { props: { title: 'My Title', content: '...' } }
}


export default function Login() {

    const [fields, setFields]   = useState({
        email: '',
        password: ''
    });

    const [status, setStatus]   = useState('normal');

    function checkToken() {
        const token = Cookies.get("token");
        if (token) return Router.push("/posts");
    }

    useEffect(() => {
        checkToken();
    }, []);

    async function loginHandler(e) {
        e.preventDefault();


        setStatus('loading');

        const loginReq  = await fetch("/api/auth/login", {
            method  : "POST",
            body    : JSON.stringify(fields),
            headers : {
                "Content-Type"  : "application/json"
            }
        });

        if (!loginReq.ok) return setStatus('error ' + loginReq.status);
        
        const loginRes  = await loginReq.json();
        
        setStatus('sukses');
        Cookies.set("token", loginRes?.token);
        
        Router.push('/posts');

    }

    function fieldHandler(e) {
        e.preventDefault();

        setFields({
            ...fields,
            [e.target.name]: e.target.value
        });

    }


    return (
        <>
            <div style={{ maxWidth: 800, margin: 'auto 50px' }}>
                <h1>Login</h1>
                <form onSubmit={loginHandler}>
                    <input onChange={fieldHandler} autoComplete="current-email" type="email" placeholder="your email" name="email" />
                    <input onChange={fieldHandler} autoComplete="current-password" type="password" placeholder="your password" name="password" />
                    <br />
                    <button type="submit">Login</button>
                    <br />
                    <p>Status  : {status}</p>
                    <Link href='/auth/register'><a>register</a></Link>
                </form>
            </div>
        </>
    );
}