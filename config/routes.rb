require "sidekiq/web"
require "sidekiq/cron/web"

Rails.application.routes.draw do
  # Redirect to localhost from 127.0.0.1 to use same IP address with Vite server
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  constraints AdminConstraint.new do
    mount Sidekiq::Web => "/sidekiq"
    mount Blazer::Engine, at: "blazer"
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "static_pages#index"
  get "/home", to: "static_pages#home"
  post "/rsvp", to: "static_pages#create_rsvp"
  post "/signup", to: "static_pages#signup"

  resources :projects, only: [ :index, :new, :create, :update, :destroy ] do
    resources :reviews, only: [ :create, :edit, :update, :destroy ], module: :project

    member do
      patch :ship
      post :check_repo
    end
  end
  get "/projects/:id", to: "projects#display"
  get "/projects/:id/manage", to: "projects#show", as: :manage_project

  resources :shop, controller: :items, only: [ :index, :create, :edit, :update, :destroy ] do
    member do
      post "buy"
      post "claim_referral_item"
    end
  end

  scope :shop do
    resources :orders, only: [ :index, :show, :destroy, :update ] do
      member do
        patch :hold
        patch :fulfill
      end
    end
  end

  get "/explore", to: "explore#index"
  get "/test", to: "test#index"
  get "/test/project", to: "test#project"
  get "/docs", to: "docs#index"
  get "/docs/:slug", to: "docs#show", as: :doc

  resources :settings
  resources :notifications, only: [ :index ]

  get "/invite", to: "invite#index"
  get "/invite/:code", to: "invite#show", as: :invite_show

  resources :users, only: [] do
    resources :ticket_adjustments, path: "adjustments", only: [ :create, :destroy ]
    resources :ticket_transfers, path: "transfers", only: [ :create, :destroy ]
  end
  get "/users/:id", to: "users#display", as: :user
  get "/me", to: "users#show"

  namespace :admin do
    resources :announcements, only: [ :index, :create, :edit, :update, :destroy ]
    resources :tags, only: [ :index, :create, :edit, :update, :destroy ]
    resources :projects, only: [ :new, :create ]
    resources :referrals, only: [ :index ] do
      collection do
        patch :update_program
        post :roll_raffle
      end
    end
  end

  get "/review", to: "review#index"
  get "/review/:id", to: "review#show", as: :review_show

  resources :ticket_transfers, only: :show do
    member do
      patch :approve
      patch :reject
    end
  end

  scope "/auth" do
    get "hca/callback", to: "auth#account_callback"
    post "logout", to: "auth#logout"
  end

  scope "admin", as: "admin" do
    get "/", to: "admin#index"
    get "/projects", to: "admin#projects"
    get "/users", to: "admin#users"
    get "/items", to: "admin#items"
    post "/items/bulk_adjust_price", to: "items#bulk_adjust_price"
    get "/stats", to: "admin#stats"
    get "/orders", to: "admin#orders"
    get "/audit-log", to: "admin#audit_log"
    get "/users/search", to: "admin#users_search"
    get "/users/:id/hackatime_projects", to: "admin#user_hackatime_projects"
    post "/users/:id/sync_to_platform", to: "admin#sync_user_to_platform"
    patch "/users/:id/role", to: "admin#update_user_role", as: "update_user_role"
    get "/ticket_transfers", to: "admin#ticket_transfers"
    get "/grants", to: "admin#grants", as: "grants"
    get "/grants/:item_id/csv", to: "admin#grants_csv", as: "grants_csv"
    get "/users/:id", to: "users#show", as: :user
  end

  post "onboarding/complete", to: "onboarding#complete"

  get "hackatime/link", to: "auth#hackatime_link"
  get "hackatime/callback", to: "auth#hackatime_callback"
end
