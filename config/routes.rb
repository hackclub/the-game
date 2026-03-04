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

  resources :projects, only: [ :index, :new, :create, :show, :update, :destroy ] do
    resources :reviews, only: [ :create, :destroy ], module: :project

    member do
      patch :ship
    end
  end

  resources :shop, controller: :items, only: [ :index, :create, :edit, :update, :destroy ] do
    member do
      post "buy"
    end
  end

  get "/explore", to: "explore#index"

  resources :notifications, only: [ :index ]

  resources :settings
  namespace :admin do
    resources :announcements, only: [ :index, :create, :edit, :update, :destroy ]
  end

  get "/review", to: "review#index"

  scope "/auth" do
    get "hca/callback", to: "auth#account_callback"
    post "logout", to: "auth#logout"
  end

  scope "admin", as: "admin" do
    get "/", to: "admin#index"
    get "/projects", to: "admin#projects"
    get "/users", to: "admin#users"
    get "/items", to: "admin#items"
    get "/stats", to: "admin#stats"
  end

  post "onboarding/complete", to: "onboarding#complete"

  get "hackatime/link", to: "auth#hackatime_link"
  get "hackatime/callback", to: "auth#hackatime_callback"
end
