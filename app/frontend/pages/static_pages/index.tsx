import { Form } from '@inertiajs/react'

export default function Landing() {
  return (
    <>
      <p>hey</p>
      <p>go sign in pls <a href="/auth/start">account oauth wahoo</a></p>
      <hr/>
      <p>or do some email login magic</p>
      <Form action="/auth/create_email" method="post">
        <input type="email" name="email" />
        <button type="submit">send me a code</button>
      </Form>
    </>
  )
}