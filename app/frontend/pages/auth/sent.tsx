import { Form } from '@inertiajs/react'

export default function Sent({ email }: { email: string }) {
  return (
    <>
      <p>hey</p>
      <p>looks like we sent you an authy codey</p>
      <p>put it here pls</p>
      <Form action="/auth/validate" method="post">
        <input name="email" type="hidden" value={email} />
        <input type="number" name="otp" />
        <button type="submit">take my otp code!</button>
      </Form>
    </>
  )
}