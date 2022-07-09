import { useState } from "react";
import { authPage } from "../../../middlewares/unauthorization";
import Router from "next/router";
import Link from "next/link";
import Nav from "../../../components/Nav";

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);
  const postReq   = await fetch("http://localhost:3000/api/posts/" + ctx.params.id, {
    method : 'GET',
    headers : {
      'Authorization' : `Bearer ${token}`
    }
  });
  if (!postReq.ok) return {notFound: true};
  const post = await postReq.json();
  return { props: { title: 'My Title', token, post } }

}

export default function PostEdit({token, post}) {
  const [fields, setFields] = useState(post.data);

  const [status, setStatus] = useState('normal');

  async function editHandler(e) {
    e.preventDefault();
    setStatus('loading');
    
    const edit = await fetch('/api/posts/' + fields.id, {
      method: 'PUT',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + token
      },
      body : JSON.stringify(fields)
    });
    if (!edit.ok) return setStatus('error');
    const res = await edit.json();
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

      <h1>Edit a Post</h1>
      <Nav />
      <form onSubmit={editHandler}>
        <input onChange={fieldHandler} autoComplete="true" type="text" name="title" value={fields.title} /><br />
        <textarea onChange={fieldHandler} autoComplete="true" type="text" name="content" value={fields.content}></textarea><br />
        <button type="submit">
          Save Changes
        </button>
        <p>Status: {status}</p>
        <Link href='/posts'>back</Link>

      </form>

    </div>
  )
}