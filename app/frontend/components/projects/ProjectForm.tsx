import { useForm, router, usePage } from "@inertiajs/react";
import type { HackatimeProject } from "@/interfaces/hackatime_project";
import type { Project } from "@/interfaces/project";
import type { ProjectTag } from "@/interfaces/project_tag";
import type { SharedProps } from "@/types";
import formatTime from "@/utils/formatTime";
import {
  isShippingPaused,
  isShippingPausedForProject,
  SHIPPING_PAUSE_MESSAGE,
} from "@/utils/shippingPause";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import arrowIcon from "@/assets/icons/arrow.svg";
import clsx from "clsx";

interface Props {
  hackatime_projects: HackatimeProject[];
  tags: ProjectTag[];
  project?: Project;
  tutorial?: boolean;
}

interface InputFieldProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
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
  onBlur,
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
        onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
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

interface ShipCheck {
  label: string;
  passed: boolean;
  loading?: boolean;
  failHint?: string;
  hint?: string;
  hintLink?: string;
  optional?: boolean;
  detail?: string;
}

function PreShipChecklist({
  open,
  checks,
  repoChecking,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  checks: ShipCheck[];
  repoChecking: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const allPassed =
    checks.every((c) => c.passed || c.optional) && !repoChecking;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    else dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="m-auto w-full max-w-md rounded-2xl border-2 border-black bg-white p-0 backdrop:bg-black/50"
    >
      <div className="bg-black px-6 py-3">
        <h2 className="text-xl font-bold text-white">Pre-ship checklist</h2>
      </div>
      <div className="px-6 py-5">
        <ul className="flex flex-col gap-3">
          {checks.map((check) => (
            <li key={check.label} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-3 text-lg">
                <span
                  className={clsx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 text-sm font-bold",
                    check.loading
                      ? "border-gray-400 text-gray-400"
                      : check.passed
                        ? "border-green-600 bg-green-600 text-white"
                        : check.optional
                          ? "border-gray-400 text-gray-400"
                          : "border-red-500 text-red-500",
                  )}
                >
                  {check.loading
                    ? "…"
                    : check.passed
                      ? "✓"
                      : check.optional
                        ? "–"
                        : "✗"}
                </span>
                <span
                  className={clsx(
                    check.loading
                      ? "text-gray-400"
                      : check.passed
                        ? "text-black"
                        : check.optional
                          ? "text-gray-400"
                          : "font-medium text-red-500",
                  )}
                >
                  {check.label}
                </span>
              </div>
              {!check.loading && !check.passed && check.failHint && (
                <span className="ml-9 text-sm text-red-500">
                  {check.failHint}
                </span>
              )}
              {check.hint && (
                <span className="ml-9 text-sm text-gray-500">
                  {check.hintLink ? (
                    <a
                      href={check.hintLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-black"
                    >
                      {check.hint}
                    </a>
                  ) : (
                    check.hint
                  )}
                </span>
              )}
              {check.detail && (
                <span className="ml-9 text-sm text-gray-600 italic">
                  "{check.detail}"
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer border-2 border-black px-5 py-3 text-center text-lg font-bold tracking-tight transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!allPassed}
            className="flex-1 cursor-pointer bg-black px-5 py-3 text-center text-lg font-bold tracking-tight text-white transition-colors hover:bg-[#fecb0d] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ship it!
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default function ProjectForm({
  hackatime_projects,
  tags,
  project,
  tutorial,
}: Props) {
  const { props } = usePage<SharedProps>();
  const { data, setData, post, patch, processing, errors, progress } = useForm({
    title: project?.title ?? "",
    desc: project?.desc ?? "",
    repo_link: project?.repo_link ?? "",
    demo_link: project?.demo_link ?? "",
    hackatime_project_keys: project?.hackatime_projects ?? ([] as number[]),
    screenshot: (project?.screenshot ? 0 : null) as File | 0 | null,
    tags: project?.tags ?? ([] as number[]),
    ai_declaration: project?.ai_declaration ?? "",
  });

  const disabled = project?.aasm_state === "submitted";
  const idvVerified = props.user.verification_status === "verified";
  const isAdmin = props.user.is_admin;
  const shippingPaused = isAdmin
    ? false
    : project
      ? isShippingPausedForProject(project)
      : isShippingPaused();
  const hasRejectionException =
    !isAdmin && isShippingPaused() && !shippingPaused;
  const rejectedAwaitingReship = project?.needs_reship_allowance ?? false;
  const shipsGloballyDisabled =
    !props.user.ships_enabled &&
    !props.user.is_debt &&
    !project?.reship_allowed;
  const shipStopped =
    !isAdmin && (rejectedAwaitingReship || shipsGloballyDisabled);
  const [showShipChecklist, setShowShipChecklist] = useState(false);
  const [repoChecking, setRepoChecking] = useState(false);
  const [repoAccessible, setRepoAccessible] = useState<boolean | null>(null);
  const [hasReadme, setHasReadme] = useState<boolean | null>(null);
  const [isGithub, setIsGithub] = useState<boolean | null>(null);

  const hasTitle = data.title.trim().length > 0;
  const hasDescription = data.desc.trim().length > 0;
  const hasDemoLink = !!data.demo_link;
  const hasScreenshot = data.screenshot !== null;
  const hasHackatimeProject =
    Array.isArray(data.hackatime_project_keys) &&
    data.hackatime_project_keys.length > 0;
  const hasRepoLink = data.repo_link.trim().length > 0;
  const hasAiDeclaration = data.ai_declaration.trim().length > 0;

  const shipChecks = [
    { label: "Project name", passed: hasTitle },
    { label: "Description", passed: hasDescription },
    {
      label: "AI Declaration",
      passed: hasAiDeclaration,
      hint: "Make sure to clearly define how it was used!",
      optional: true,
    },
    {
      label: "Demo link",
      passed: hasDemoLink,
    },
    { label: "Screenshot", passed: hasScreenshot },
    {
      label: "Public code repository",
      passed: hasRepoLink && (repoAccessible === true || !isGithub),
      loading: repoChecking,
      failHint: "Check if your repository is public!",
      hint:
        hasRepoLink && !isGithub
          ? "This repository isn't on GitHub - double check that it exists!"
          : "",
    },
    {
      label: "Good readme",
      passed: hasRepoLink && (hasReadme === true || !isGithub),
      loading: repoChecking,
      hint: "Unsure? Check this out!",
      hintLink: "https://hack.club/hctg/guide",
    },
    { label: "Hackatime project attached", passed: hasHackatimeProject },
  ];

  const checkRepo = useCallback(async () => {
    if (!project || !hasRepoLink) {
      setRepoAccessible(false);
      setHasReadme(false);
      setIsGithub(false);
      return;
    }
    setRepoChecking(true);
    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      const res = await fetch(`/projects/${project.id}/check_repo`, {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken || "",
          Accept: "application/json",
        },
      });
      const json = await res.json();
      setRepoAccessible(json.accessible);
      setHasReadme(json.has_readme);
      setIsGithub(json.is_github);
    } catch {
      setRepoAccessible(false);
      setHasReadme(false);
      setIsGithub(false);
    } finally {
      setRepoChecking(false);
    }
  }, [project, hasRepoLink]);

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

  function openShipChecklist(e: React.MouseEvent) {
    e.stopPropagation();
    setRepoAccessible(null);
    patch(`/projects/${project!.id}`, {
      forceFormData: true,
      onSuccess: () => {
        setShowShipChecklist(true);
        checkRepo();
      },
    });
  }

  function confirmShip() {
    setShowShipChecklist(false);
    patch(`/projects/${project!.id}`, {
      forceFormData: true,
      onFinish: () => router.patch(`/projects/${project!.id}/ship`),
    });
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
          onBlur={(value) => {
            if (
              value.startsWith("https://github.com/") &&
              value.endsWith(".git")
            ) {
              setData("repo_link", value.slice(0, -4));
            }
          }}
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
          <div className="mt-1 max-h-60 overflow-y-auto border border-[#cacaca] bg-[#d9d9d9]">
            {sortedHackatimeProjects.map((hp) => {
              const isSelected = data.hackatime_project_keys.includes(hp.id);
              return (
                <button
                  key={hp.id}
                  type="button"
                  disabled={disabled}
                  className={clsx(
                    "flex w-full items-center px-4 py-2 text-left text-xl transition-colors",
                    isSelected
                      ? "bg-black font-bold text-white"
                      : "hover:bg-[#c9c9c9] disabled:opacity-40",
                  )}
                  onClick={() => {
                    if (isSelected) {
                      setData(
                        "hackatime_project_keys",
                        data.hackatime_project_keys.filter(
                          (id) => id !== hp.id,
                        ),
                      );
                    } else {
                      setData("hackatime_project_keys", [
                        ...data.hackatime_project_keys,
                        hp.id,
                      ]);
                    }
                  }}
                >
                  {hp.name} ({formatTime(hp.total_seconds)})
                </button>
              );
            })}
          </div>
          {data.hackatime_project_keys.length > 0 && (
            <div className="mt-2">
              <span className="text-lg font-semibold text-[#565656]">
                Selected projects:
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.hackatime_project_keys.map((id) => {
                  const hp = hackatime_projects.find((p) => p.id === id);
                  if (!hp) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 bg-black px-3 py-1.5 text-lg font-bold text-white"
                    >
                      <span>{hp.name}</span>
                      {!disabled && (
                        <button
                          type="button"
                          className="cursor-pointer text-white/70 transition-colors hover:text-white"
                          onClick={() =>
                            setData(
                              "hackatime_project_keys",
                              data.hackatime_project_keys.filter(
                                (k) => k !== id,
                              ),
                            )
                          }
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <FieldHeading
            label="Tags"
            description="Select applicable tags for this project"
          />
          <select
            className="mt-1 border-[#cacaca] bg-[#d9d9d9] p-2 text-xl outline-none"
            multiple
            onChange={(e) =>
              setData(
                "tags",
                [...e.target.selectedOptions].map((o) => Number(o.value)),
              )
            }
            disabled={disabled}
          >
            {tags.map((tag) => (
              <option
                key={tag.id}
                value={tag.id}
                selected={data.tags.includes(tag.id)}
              >
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-row flex-wrap items-end gap-3">
            <label className="smoothing-black text-3xl font-bold tracking-[-0.02em]">
              AI Declaration
            </label>
            <span className="text-xl text-[#565656]">
              Projects should be mostly human built!{" "}
              <a
                href="https://docs.google.com/document/d/1qaSabYkvaPVHtioIsBYAXtEobP4fbqHXZ3oyKS9RQa8/edit?tab=t.a49qvlml6s0m#heading=h.3083lok045i"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black"
              >
                Check this out if you're unsure what to put :D
              </a>
            </span>
          </div>
          <textarea
            className="mt-1 h-[117px] resize-none border-[#cacaca] bg-[#d9d9d9] p-4 text-xl outline-none"
            value={data.ai_declaration}
            onChange={(e) => setData("ai_declaration", e.target.value)}
            disabled={disabled}
          />
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
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  {project.reported_seconds > project.approved_seconds && (
                    <button
                      className={clsx(
                        "group flex h-[59px] w-full items-center justify-center gap-3 text-xl font-bold transition-colors",
                        shippingPaused || shipStopped
                          ? "cursor-not-allowed bg-gray-300 text-gray-500"
                          : "cursor-pointer bg-[#fecb0d] text-black hover:bg-[#e5b80b] disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                      type="button"
                      onClick={
                        shippingPaused || shipStopped
                          ? undefined
                          : openShipChecklist
                      }
                      disabled={
                        processing ||
                        (!isAdmin && !idvVerified) ||
                        shippingPaused ||
                        shipStopped
                      }
                    >
                      {!isAdmin && !idvVerified
                        ? "Verify to ship"
                        : project.aasm_state === "approved" ||
                            project.aasm_state === "rejected"
                          ? "Re-ship"
                          : "Ship"}
                    </button>
                  )}
                  <PreShipChecklist
                    open={showShipChecklist}
                    checks={shipChecks}
                    repoChecking={repoChecking}
                    onCancel={() => setShowShipChecklist(false)}
                    onConfirm={confirmShip}
                  />
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
                {shippingPaused &&
                  project.reported_seconds > project.approved_seconds && (
                    <p className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700">
                      {SHIPPING_PAUSE_MESSAGE}
                    </p>
                  )}
                {hasRejectionException &&
                  project.reported_seconds > project.approved_seconds && (
                    <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Shipping is temporarily paused, but you can re-ship this
                      project because it was rejected in the two days before the
                      pause began. Note: if your project is rejected again while
                      shipping is paused, you will not be able to re-ship it
                      until the pause ends at 5:00pm ET on May 11th, 2026.
                    </p>
                  )}
                {!shippingPaused &&
                  rejectedAwaitingReship &&
                  project.reported_seconds > project.approved_seconds && (
                    <p className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-base font-semibold text-red-800">
                      This project was rejected. A reviewer needs to allow it
                      to be reshipped before you can resubmit it.
                    </p>
                  )}
                {!shippingPaused &&
                  !rejectedAwaitingReship &&
                  shipsGloballyDisabled &&
                  project.reported_seconds > project.approved_seconds && (
                    <p className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-base font-semibold text-red-800">
                      Shipping is currently closed platform-wide. Please check
                      back later.
                    </p>
                  )}
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
