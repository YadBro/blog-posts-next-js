// import Cookies from "js-cookie";
// import Router from "next/router";
// import { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { authPage } from "../../middlewares/unauthorization";
import Nav from "../../components/Nav";

export async function getServerSideProps(ctx) {
    const { token } = await authPage(ctx);
    const postReq   = await fetch("http://localhost:3000/api/posts", {
        method : 'GET',
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    });
    const posts     = await postReq.json();

    return {props: {title: 'My Title', posts, token}}

}

export default function Posts({posts, token}) {
  const [postsData, setPostsData] = useState(posts.data);
  function PostsElement() {
  return (
  <>
      {postsData.map(item => (
      <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          <Link href={'/posts/edit/' + item.id}><button style={{ cursor: "pointer" }}>edit</button></Link>
          <button onClick={deleteHandler.bind(this, item.id)} style={{ cursor: "pointer" }}>delete</button>
          <hr />
      </div>
      ))}
  </>
  )
  }
  async function deleteHandler(id, e) {
    e.preventDefault();
    const ask = confirm('Apakah data ini akan dihapus');
    if (ask) {
      const newData = postsData.filter(post => post.id !== id);
      const deleted = await fetch('/api/posts/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });
      
      if (!deleted.ok) return console.error(deleted.statusText);
      setPostsData(newData);
      const res = await deleted.json();
    }
  }

    return (
        
    <div className="" style={{ maxWidth: 800, margin: "auto 50px" }}>
        <h1>Posts</h1>
        <Nav />
        <PostsElement />
    </div>
    );
}