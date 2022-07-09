import Link from "next/link";
import Cookies from "js-cookie";
import Router from "next/router";

export default function Nav() {
  const logoutHandler = (e) => {
    e.preventDefault();

    Cookies.remove('token');
    return Router.replace('/auth/login'); // pake replace biar gak ada history
  }
  return (
    <>
      <Link href={'/posts'}>Posts</Link>
      &nbsp; | &nbsp;
      <Link href={'/posts/create'}>Add Post</Link>
      &nbsp; | &nbsp;
      <a href='#' onClick={logoutHandler.bind(this)}>Logout</a>
    </>
  );
}