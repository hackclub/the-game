Rails.application.routes.draw do
  # Redirect to localhost from 127.0.0.1 to use same IP address with Vite server
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  mount Blazer::Engine, at: "blazer", constraints: ->(request) {
    user_id = request.session[:user_id]
    user_id && User.find_by(id: user_id)&.admin?
  }

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "static_pages#index"
  get "/home", to: "static_pages#home"
  post "/rsvp", to: "static_pages#create_rsvp"
  post "/signup", to: "static_pages#signup"
  resources :projects, only: [ :index, :new, :create, :edit, :update, :destroy ] do
    member do
      patch :ship
    end
  end


  get "/admin", to: "admin#index"
  get "/explore", to: "explore#index"

  resources :settings

  scope "/auth" do
    get "account_callback", to: "auth#account_callback"
    get "start", to: "auth#start"
    post "logout", to: "auth#logout"
    post "create_email", to: "auth#create_email"
    post "create_or_login_user", to: "auth#create_or_login_user"
    get "account_link", to: "auth#account_link"
    get "sent", to: "auth#sent"
    post "validate", to: "auth#validate"
  end

  get "hackatime/link", to: "auth#hackatime_link"
  get "hackatime/callback", to: "auth#hackatime_callback"
end
