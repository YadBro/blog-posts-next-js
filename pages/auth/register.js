import Link from "next/link";
import { useState } from "react";
import { unauthPage } from "../../middlewares/unauthorization";


export async function getServerSideProps(ctx) {
    await unauthPage(ctx);
    return { props: { title: 'My Title', content: '...' } }
}



export default function Register() {

  const [fields, setFields]   = useState({
    email       : '',
    password    : ''
  });

  const [status, setStatus]    = useState('normal');

  async function registerHandler(e) {
    e.preventDefault();

    setStatus('loading');

    const registerReq   = await fetch("/api/auth/register", {
      method  : "POST",
      body    : JSON.stringify(fields),
      headers : {
          "Content-Type"  : "application/json"
      }
    });


    if (!registerReq.ok) return setStatus('error '+ registerReq.status);

    const registerRes  = await registerReq.json();

    setStatus('success');
  }

  function fieldHandler(e) {

    setFields({
        ...fields,
        [e.target.name]       : e.target.value
    });

  }



  return (
    <>
      <div style={{ maxWidth: 800, margin:"auto 50px" }}>
        <h1>Register</h1>
        <form onSubmit={registerHandler} >
          <input onChange={fieldHandler} name="email" required autoComplete="true" type="email" id="email" placeholder="your email" />
          <br />
          <input onChange={fieldHandler} name="password" required autoComplete="true" type="password" id="password" placeholder="your password" />
          <br />
          <button type="submit">Register</button>
          <div className="">Output {status}</div>
          <Link href='/auth/login'><a>login</a></Link>
        </form>
      </div>
    </>
  );
}