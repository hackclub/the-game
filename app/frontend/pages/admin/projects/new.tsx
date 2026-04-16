import Layout from "@/layouts/layout";
import { useForm } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import type { ProjectTag } from "@/interfaces/project_tag";
import type { HackatimeProject } from "@/interfaces/hackatime_project";

interface UserResult {
  id: number;
  username: string;
  avatar: string;
}

interface Props {
  tags: ProjectTag[];
  errors?: string[];
}

export default function NewProject({ tags, errors }: Props) {
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hackatimeProjects, setHackatimeProjects] = useState<HackatimeProject[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, setData, post, processing, progress } = useForm({
    user_id: "" as string | number,
    title: "",
    desc: "",
    repo_link: "",
    demo_link: "",
    ai_declaration: "",
    screenshot: null as File | null,
    hackatime_project_keys: [] as number[],
    aasm_state: "approved",
    approved_seconds: "",
    total_seconds: "",
  });

  useEffect(() => {
    if (!userQuery.trim()) {
      setUserResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      const res = await fetch(
        `/admin/users/search?q=${encodeURIComponent(userQuery)}`,
      );
      const json = await res.json();
      setUserResults(json);
      setShowDropdown(true);
    }, 250);
  }, [userQuery]);

  async function selectUser(user: UserResult) {
    setSelectedUser(user);
    setData({ ...data, user_id: user.id, hackatime_project_keys: [] });
    setUserQuery(user.username);
    setShowDropdown(false);

    const res = await fetch(`/admin/users/${user.id}/hackatime_projects`);
    const json = await res.json();
    setHackatimeProjects(json);
  }

  function toggleHackatimeProject(hp: HackatimeProject) {
    const keys = data.hackatime_project_keys;
    if (keys.includes(hp.id)) {
      setData("hackatime_project_keys", keys.filter((id) => id !== hp.id));
    } else {
      setData("hackatime_project_keys", [...keys, hp.id]);
    }
  }

  function isSelected(hp: HackatimeProject) {
    return data.hackatime_project_keys.includes(hp.id);
  }

  function formatHours(seconds: number) {
    return (seconds / 3600).toFixed(1) + "h";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post("/admin/projects", { forceFormData: true });
  }

  return (
    <Layout>
      <div className="max-w-2xl px-4">
        <div className="mb-6">
          <a href="/admin/projects" className="text-blue-500 underline text-sm">
            ← Back to Projects
          </a>
          <h1 className="mt-2 text-3xl font-bold">Create Project as User</h1>
          <p className="mt-1 text-gray-500">
            Import a project from another YSWS program or create one on behalf
            of a user.
          </p>
        </div>

        {errors && errors.length > 0 && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
            <ul className="list-disc pl-4 text-red-700">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="font-bold">
              User <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className="w-full rounded-md border border-gray-300 p-2"
                type="text"
                placeholder="Search by username..."
                value={userQuery}
                onChange={(e) => {
                  setUserQuery(e.target.value);
                  setSelectedUser(null);
                  setData({ ...data, user_id: "", hackatime_project_keys: [] });
                  setHackatimeProjects([]);
                }}
                onFocus={() => userResults.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
              {showDropdown && userResults.length > 0 && (
                <div className="absolute z-10 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                  {userResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left hover:bg-gray-100"
                      onMouseDown={() => selectUser(user)}
                    >
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{user.username}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        #{user.id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedUser && (
              <p className="mt-1 text-sm text-green-600">
                Selected: {selectedUser.username} (ID: {selectedUser.id})
              </p>
            )}
          </div>

          {selectedUser && (
            <div className="flex flex-col">
              <label className="font-bold">Hackatime Projects</label>
              {hackatimeProjects.length === 0 ? (
                <p className="mt-1 text-sm text-gray-400">
                  No Hackatime projects found for this user.
                </p>
              ) : (
                <div className="mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-300">
                  {hackatimeProjects.map((hp) => (
                    <button
                      key={hp.id}
                      type="button"
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                        isSelected(hp)
                          ? "bg-black font-bold text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleHackatimeProject(hp)}
                    >
                      <span>{hp.name}</span>
                      <span className="ml-4 shrink-0 tabular-nums opacity-60">
                        {formatHours(hp.total_seconds)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {data.hackatime_project_keys.length > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {data.hackatime_project_keys.length} selected
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col">
            <label className="font-bold">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="rounded-md border border-gray-300 p-2"
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="rounded-md border border-gray-300 p-2"
              rows={4}
              value={data.desc}
              onChange={(e) => setData("desc", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Repo Link</label>
            <input
              className="rounded-md border border-gray-300 p-2"
              type="url"
              placeholder="https://github.com/..."
              value={data.repo_link}
              onChange={(e) => setData("repo_link", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Demo Link</label>
            <input
              className="rounded-md border border-gray-300 p-2"
              type="url"
              placeholder="https://..."
              value={data.demo_link}
              onChange={(e) => setData("demo_link", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">AI Declaration</label>
            <textarea
              className="rounded-md border border-gray-300 p-2"
              rows={2}
              value={data.ai_declaration}
              onChange={(e) => setData("ai_declaration", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Screenshot</label>
            {data.screenshot && (
              <div className="relative mt-1 h-52 w-fit">
                <img
                  src={URL.createObjectURL(data.screenshot)}
                  alt="Screenshot preview"
                  className="block max-h-full w-auto max-w-full object-contain"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 h-8 w-8 cursor-pointer bg-black text-sm font-bold text-white"
                  onClick={() => setData("screenshot", null)}
                >
                  ✕
                </button>
              </div>
            )}
            <input
              className="mt-1 cursor-pointer rounded-md border border-gray-300 p-2"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/tiff,image/webp,image/heic"
              onChange={(e) => setData("screenshot", e.target.files?.[0] ?? null)}
            />
            {progress && (
              <progress value={progress.percentage} max="100">
                {progress.percentage}%
              </progress>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Initial State</label>
            <select
              className="rounded-md border border-gray-300 p-2"
              value={data.aasm_state}
              onChange={(e) => setData("aasm_state", e.target.value)}
            >
              <option value="pending">Pending (in progress)</option>
              <option value="submitted">Submitted (under review)</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {data.aasm_state === "approved" && (
            <div className="flex flex-col">
              <label className="font-bold">Approved Seconds</label>
              <input
                className="rounded-md border border-gray-300 p-2"
                type="number"
                min={0}
                placeholder="e.g. 72000 for 20 hours"
                value={data.approved_seconds}
                onChange={(e) => setData("approved_seconds", e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                {data.approved_seconds
                  ? `${(parseInt(data.approved_seconds) / 3600).toFixed(1)} hours`
                  : ""}
              </p>
            </div>
          )}

          {data.aasm_state === "submitted" && (
            <div className="flex flex-col">
              <label className="font-bold">Total Seconds (for review)</label>
              <input
                className="rounded-md border border-gray-300 p-2"
                type="number"
                min={0}
                placeholder="e.g. 72000 for 20 hours"
                value={data.total_seconds}
                onChange={(e) => setData("total_seconds", e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                {data.total_seconds
                  ? `${(parseInt(data.total_seconds) / 3600).toFixed(1)} hours`
                  : ""}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={processing || !selectedUser}
            className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white disabled:opacity-50"
          >
            {processing ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
