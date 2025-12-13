import { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import Sidebar from '../../components/dashboard/Sidebar'

interface Project {
  id: number
  name: string
  hackatime_name: string
  repo_url: string | null
  total_seconds: number
  hours: number
}

interface User {
  id: number
  email: string
  username: string | null
  slack_id: string | null
  admin: boolean
}

interface ProjectsProps {
  user: User
  projects: Project[]
  availableHackatimeProjects: string[]
}

function formatHours(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes}m`
  }
  return `${hours}h`
}

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  availableProjects: string[]
}

function NewProjectModal({ isOpen, onClose, availableProjects }: NewProjectModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    repo_url: '',
    hackatime_name: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/projects', {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  const isValid = data.hackatime_name !== ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border-4 border-black p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">New Project</h2>

        {availableProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No Hackatime projects available</p>
            <p className="mt-2 text-sm">Start coding with Hackatime to create projects here!</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 border-2 border-black px-6 py-2 font-medium hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="hackatime_name" className="block text-sm font-medium mb-1">
                Link to Hackatime Project <span className="text-red-500">*</span>
              </label>
              <select
                id="hackatime_name"
                value={data.hackatime_name}
                onChange={(e) => {
                  setData('hackatime_name', e.target.value)
                  if (!data.name) {
                    setData('name', e.target.value)
                  }
                }}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select a Hackatime project...</option>
                {availableProjects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              {errors.hackatime_name && <p className="text-red-500 text-sm mt-1">{errors.hackatime_name}</p>}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Awesome Project"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="repo_url" className="block text-sm font-medium mb-1">
                Repository URL (optional)
              </label>
              <input
                id="repo_url"
                type="url"
                value={data.repo_url}
                onChange={(e) => setData('repo_url', e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username/repo"
              />
              {errors.repo_url && <p className="text-red-500 text-sm mt-1">{errors.repo_url}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-black p-3 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing || !isValid}
                className="flex-1 bg-blue-500 text-white p-3 font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

interface EditProjectModalProps {
  project: Project | null
  onClose: () => void
}

function EditProjectModal({ project, onClose }: EditProjectModalProps) {
  const { data, setData, patch, processing, errors } = useForm({
    name: project?.name || '',
    repo_url: project?.repo_url || '',
  })

  if (!project) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    patch(`/projects/${project.id}`, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border-4 border-black p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-2">Edit Project</h2>
        <p className="text-gray-500 text-sm mb-6">Linked to: {project.hackatime_name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit_name" className="block text-sm font-medium mb-1">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit_name"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Awesome Project"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="edit_repo_url" className="block text-sm font-medium mb-1">
              Repository URL (optional)
            </label>
            <input
              id="edit_repo_url"
              type="url"
              value={data.repo_url}
              onChange={(e) => setData('repo_url', e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username/repo"
            />
            {errors.repo_url && <p className="text-red-500 text-sm mt-1">{errors.repo_url}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-black p-3 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 bg-blue-500 text-white p-3 font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Projects({ user, projects, availableHackatimeProjects }: ProjectsProps) {
  const [showNewModal, setShowNewModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const displayName = user.username || user.email.split('@')[0]

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Head title="Projects - Hack Club: The Game" />

      <Sidebar user={{ name: displayName, slackId: user.slack_id || '', admin: user.admin }} activeItem="projects" />

      <main className="flex-1 p-8">
        <div className="bg-white border-4 border-black p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Your Projects</h1>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No projects found</p>
              <p className="mt-2">Start coding with Hackatime to see your projects here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border-2 border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-lg">{project.name}</span>
                      <p className="text-gray-500 text-sm">{project.hackatime_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-blue-600">{formatHours(project.hours)}</span>
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-2 text-gray-500 hover:text-black transition-colors"
                      title="Edit project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
                          router.delete(`/projects/${project.id}`)
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <NewProjectModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        availableProjects={availableHackatimeProjects}
      />

      <EditProjectModal
        project={editingProject}
        onClose={() => setEditingProject(null)}
      />
    </div>
  )
}
