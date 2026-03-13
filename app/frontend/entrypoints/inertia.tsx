import { createInertiaApp, type ResolvedComponent } from "@inertiajs/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";
import "./application.css";

void createInertiaApp({
  // Set default page title
  // see https://inertia-rails.dev/guide/title-and-meta
  //
  // title: title => title ? `${title} - App` : 'App',

  // Disable progress bar
  //
  // see https://inertia-rails.dev/guide/progress-indicators
  // progress: false,

  resolve: (name) => {
    const pages = import.meta.glob<ResolvedComponent>("../pages/**/*.tsx", {
      eager: true,
    });
    const page = pages[`../pages/${name}.tsx`];
    console.log(page);
    if (!page) {
      console.error(`Missing Inertia page component: '${name}.tsx'`);
    }

    // To use a default layout, import the Layout component
    // and use the following line.
    // see https://inertia-rails.dev/guide/pages#default-layouts
    //
    // page.default.layout ||= (page) => (<Layout>{page}</Layout>)

    return page;
  },

  setup({ el, App, props }) {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_TOKEN, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      defaults: "2026-01-30",
    });
    
    createRoot(el).render(
      <StrictMode>
        <PostHogProvider client={posthog}>
          <App {...props} />
        </PostHogProvider>
      </StrictMode>,
    );
  },

  defaults: {
    form: {
      forceIndicesArrayFormatInFormData: true,
    },
    future: {
      useDataInertiaHeadAttribute: true,
      useDialogForErrorModal: true,
      preserveEqualProps: true,
    },
  },
}).catch((error) => {
  // This ensures this entrypoint is only loaded on Inertia pages
  // by checking for the presence of the root element (#app by default).
  // Feel free to remove this `catch` if you don't need it.
  if (document.getElementById("app")) {
    throw error;
  } else {
    console.error(
      "Missing root element.\n\n" +
        "If you see this error, it probably means you loaded Inertia.js on non-Inertia pages.\n" +
        'Consider moving <%= vite_typescript_tag "inertia.tsx" %> to the Inertia-specific layout instead.',
    );
  }
});
