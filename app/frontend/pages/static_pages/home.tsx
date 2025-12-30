import { Link } from "@inertiajs/react";

export default function Home({
  account_linked,
  hackatime_linked,
  user,
}: {
  account_linked: boolean;
  hackatime_linked: boolean;
}) {
  return (
    <>
      <p>hey!</p>
      <p>welcome home</p>
      <Link method="post" href="/auth/logout">
        logout if you want
      </Link>
      <hr />
      {!account_linked && (
        <>
          <p>yo chat we need to verify your identity</p>
          <p>click the lil link below to link with hack club account pls thx</p>
          <a href="/auth/start">link me!</a>
        </>
      )}
      {account_linked && !hackatime_linked && (
        <>
          <p>yo chat we need to link to hackatime</p>
          <p>
            go to <a href="https://hackatime.hackclub.com">hackatime</a> and
            auth with the same slack account
          </p>
        </>
      )}
    </>
  );
}
