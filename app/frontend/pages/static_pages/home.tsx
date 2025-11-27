import { Link } from '@inertiajs/react'

export default function Home({ account_linked }: { account_linked: boolean }) {
  return (
    <>
      <p>hey</p>
      <p>welcome home bro</p>
      <Link method="post" href="/auth/logout">logout if you want</Link>
      <hr />
      {!account_linked && <>
        <p>yo chat we need to verify your identity</p>
        <p>click the lil link below to link with hack club account pls thx</p>
        <a href="/auth/start">link me!</a>
      </>}
    </>
  )
}