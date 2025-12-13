import { Head, Link, useForm } from '@inertiajs/react'

interface Props {
  ban_types: string[]
}

export default function AdminUsersNew({ ban_types }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    username: '',
    admin: false,
    is_banned: false,
    ban_type: '',
    birthday: '',
    internal_notes: '',
    ysws_verified: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/admin/users')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head title="New User" />

      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">New User</h1>
          <Link href="/admin/users" className="text-blue-600 hover:text-blue-800">
            ← Back to Users
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Birthday</label>
            <input
              type="date"
              value={data.birthday}
              onChange={(e) => setData('birthday', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.birthday && <p className="mt-1 text-sm text-red-600">{errors.birthday}</p>}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <input
                id="admin"
                type="checkbox"
                checked={data.admin}
                onChange={(e) => setData('admin', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="admin" className="ml-2 block text-sm text-gray-900">Admin</label>
            </div>

            <div className="flex items-center">
              <input
                id="ysws_verified"
                type="checkbox"
                checked={data.ysws_verified}
                onChange={(e) => setData('ysws_verified', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="ysws_verified" className="ml-2 block text-sm text-gray-900">YSWS Verified</label>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ban Settings</h3>
            
            <div className="flex items-center mb-4">
              <input
                id="is_banned"
                type="checkbox"
                checked={data.is_banned}
                onChange={(e) => setData('is_banned', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="is_banned" className="ml-2 block text-sm text-gray-900">Banned</label>
            </div>

            {data.is_banned && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Ban Type</label>
                <select
                  value={data.ban_type}
                  onChange={(e) => setData('ban_type', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select ban type...</option>
                  {ban_types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
            <textarea
              rows={4}
              value={data.internal_notes}
              onChange={(e) => setData('internal_notes', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.internal_notes && <p className="mt-1 text-sm text-red-600">{errors.internal_notes}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/users"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {processing ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
