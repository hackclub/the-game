import { useForm, router } from "@inertiajs/react";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { Project } from "@/interfaces/project";
import formatTime from "@/utils/formatTime";
import { useMemo } from "react";
import arrowIcon from "@/assets/icons/arrow.svg";
import clsx from "clsx";

interface Props {
  hackatime_projects: HackatimeProject[];
  project?: Project;
  tutorial?: boolean;
}

interface InputFieldProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | string[];
  disabled?: boolean;
  required?: boolean;
  type?: string;
}

interface FieldHeadingProps {
  label: string;
  description: string;
  required?: boolean;
}

function FieldHeading({ label, description, required }: FieldHeadingProps) {
  return (
    <div className="flex flex-row flex-wrap items-end gap-3">
      <label className="smoothing-black text-3xl font-bold tracking-[-0.02em]">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <span className="text-xl text-[#565656]">{description}</span>
    </div>
  );
}

function InputField({
  label,
  description,
  value,
  onChange,
  error,
  disabled,
  required,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <FieldHeading
        label={label}
        description={description}
        required={required}
      />

      <input
        className="mt-1 h-12 border-[#cacaca] bg-[#d9d9d9] px-4 text-xl transition-all"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | string[];
  disabled?: boolean;
  required?: boolean;
}

function TextareaField({
  label,
  description,
  value,
  onChange,
  error,
  disabled,
  required,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <FieldHeading
        label={label}
        description={description}
        required={required}
      />
      <textarea
        className="mt-1 h-[117px] resize-none border-[#cacaca] bg-[#d9d9d9] p-4 text-xl outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default function ProjectForm({
  hackatime_projects,
  project,
  tutorial,
}: Props) {
  const { data, setData, post, patch, processing, errors, progress } = useForm({
    title: project?.title ?? "",
    desc: project?.desc ?? "",
    repo_link: project?.repo_link ?? "",
    demo_link: project?.demo_link ?? "",
    hackatime_project_keys: project?.hackatime_projects ?? ([] as number[]),
    screenshot: (project?.screenshot ? 0 : null) as File | 0 | null,
  });

  const disabled = project?.aasm_state === "submitted";

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (project) {
      patch(`/projects/${project.id}`, {
        forceFormData: true,
      });
    } else {
      post("/projects/", {
        forceFormData: true,
      });
    }
  }

  function shipProject(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Are you sure you want to ship this project?")) {
      patch(`/projects/${project!.id}`, {
        forceFormData: true,
        onFinish: () => router.patch(`/projects/${project!.id}/ship`),
      });
    }
  }

  function deleteProject(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      router.delete(`/projects/${project!.id}`);
    }
  }

  const sortedHackatimeProjects = useMemo(
    () => hackatime_projects.sort((a, b) => b.total_seconds - a.total_seconds),
    [hackatime_projects],
  );

  return (
    <div className="flex w-full flex-col px-16">
      <form onSubmit={submit} className="flex w-full flex-col gap-6">
        <InputField
          label="Title"
          description="Give your project a name"
          value={data.title}
          onChange={(value) => setData("title", value)}
          error={errors.title}
          disabled={disabled}
          required
        />

        <TextareaField
          label="Description"
          description="Describe what your project does"
          value={data.desc}
          onChange={(value) => setData("desc", value)}
          error={errors.desc}
          disabled={disabled}
          required
        />

        {tutorial && (
          <p className="text-lg text-[#565656] italic">
            You don't need to fill these out right now, but you'll need them
            before submitting your project!
          </p>
        )}

        <InputField
          label="Demo Link"
          description="A link to your live project demo"
          value={data.demo_link}
          onChange={(value) => setData("demo_link", value)}
          error={errors.demo_link}
          disabled={disabled}
          type="url"
        />

        <InputField
          label="Repository Link"
          description="Link to your source code repository"
          value={data.repo_link}
          onChange={(value) => setData("repo_link", value)}
          error={errors.repo_link}
          disabled={disabled}
          type="url"
        />

        <div className="flex flex-col gap-1">
          <FieldHeading
            label="Screenshot"
            description="Upload a screenshot of your project"
          />
          {data.screenshot === 0 && (
            <div className="relative mt-1 h-52 w-fit">
              <img
                src={project?.screenshot}
                alt="Uploaded screenshot"
                className="block max-h-full w-auto max-w-full object-contain"
              />
              {!disabled && (
                <button
                  type="button"
                  className="absolute top-2 right-2 h-8 w-8 cursor-pointer bg-black text-sm font-bold text-white"
                  onClick={() => setData("screenshot", null)}
                >
                  ✕
                </button>
              )}
            </div>
          )}
          {!disabled && (
            <input
              className="mt-1 cursor-pointer border border-[#cacaca] bg-[#d9d9d9] p-4 font-bold"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/tiff,image/webp,image/heic"
              onChange={(e) =>
                setData("screenshot", e.target.files?.[0] ?? null)
              }
            />
          )}
          {progress && (
            <progress value={progress.percentage} max="100">
              {progress.percentage}%
            </progress>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <FieldHeading
            label="Hackatime Projects"
            description="Select Hackatime projects to link"
          />
          <select
            className="mt-1 border-[#cacaca] bg-[#d9d9d9] p-2 text-xl outline-none"
            multiple
            onChange={(e) =>
              setData(
                "hackatime_project_keys",
                [...e.target.selectedOptions].map((o) => Number(o.value)),
              )
            }
            disabled={disabled}
          >
            <option
              disabled
              selected={!project?.hackatime_projects?.length}
              value="-1"
            >
              Select a project
            </option>
            {sortedHackatimeProjects.map((hp) => (
              <option
                key={hp.id}
                value={hp.id}
                selected={data.hackatime_project_keys.includes(hp.id)}
              >
                {hp.name} ({formatTime(hp.total_seconds)})
              </option>
            ))}
          </select>
        </div>

        {!disabled && (
          <>
            <button
              className={clsx(
                "group flex h-[59px] w-full cursor-pointer items-center justify-center gap-3 bg-black text-xl font-bold text-white transition-colors",
                "hover:border-4 hover:bg-white hover:text-black disabled:opacity-50",
              )}
              type="submit"
              disabled={processing}
            >
              <img
                src={arrowIcon}
                alt=""
                className="h-5 w-5 transition-all group-hover:invert"
              />
              {project ? "Update project" : "Create project"}
            </button>
            {project && (
              <div className="flex gap-3">
                <button
                  className={clsx(
                    "group flex h-[59px] w-full cursor-pointer items-center justify-center gap-3 bg-[#fecb0d] text-xl font-bold text-black transition-colors",
                    "hover:bg-[#e5b80b] disabled:opacity-50",
                  )}
                  type="button"
                  onClick={shipProject}
                  disabled={processing}
                >
                  {project.aasm_state === "approved" ||
                  project.aasm_state === "rejected"
                    ? "Re-ship"
                    : "Ship"}
                </button>
                <button
                  className={clsx(
                    "group flex h-[59px] w-full cursor-pointer items-center justify-center gap-3 bg-red-500 text-xl font-bold text-white transition-colors",
                    "hover:bg-red-600 disabled:opacity-50",
                  )}
                  type="button"
                  onClick={deleteProject}
                  disabled={processing}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
