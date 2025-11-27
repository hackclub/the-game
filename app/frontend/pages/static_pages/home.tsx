import { Link } from '@inertiajs/react'

export default function Home() {
  return (
    <>
      <p>hey</p>
      <p>welcome home bro</p>
      <Link method="post" href="/auth/logout">logout if you want</Link>
    </>
  )
}