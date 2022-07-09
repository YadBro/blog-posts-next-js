import { useState } from "react";
import { authPage } from "../../middlewares/unauthorization";
import Router from "next/router";
import Nav from "../../components/Nav";

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { title: 'My Title', token } }

}

export default function PostCreate({token}) {
  const [fields, setFields] = useState({
    title: '',
    content: ''
  });

  const [status, setStatus] = useState('normal');

  async function createHandler(e) {
    e.preventDefault();
    setStatus('loading');
    
    const create = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + token
      },
      body : JSON.stringify(fields)
    });

    if (!create.ok) return setStatus('error');
    const res = await create.json();
    setStatus('success');

    Router.push('/posts');
  }

  function fieldHandler(e) {
    setFields({
      ...fields,
      [e.target.name] : e.target.value
    });
  }


  return (
    <div>

      <h1>Create a Post</h1>
      <Nav />
      <form onSubmit={createHandler}>
        <input onChange={fieldHandler} autoComplete="true" type="text" name="title" placeholder="title" /><br />
        <textarea onChange={fieldHandler} autoComplete="true" type="text" name="content" placeholder="content"></textarea><br />
        <button type="submit">
          Create Post
        </button>
        <p>Status: {status}</p>
      </form>

    </div>
  )
}