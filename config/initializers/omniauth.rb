OmniAuth.config.allowed_request_methods = [ :get, :post ]
OmniAuth.config.silence_get_warning = true

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :openid_connect,
    name: :hca,
    allow_authorize_params: [ :login_hint ],
    scope: Rails.env.production? ? [ :openid, :email, :profile, :address, :birthdate, :slack_id, :verification_status ] : [ :openid, :profile, :email, :name, :slack_id, :verification_status ],
    response_type: :code,
    issuer: ENV.fetch("HCA_URL", "https://auth.hackclub.com"),
    discovery: true,
    client_options: {
      identifier: ENV["ACCOUNT_CLIENT_ID"],
      secret: ENV["ACCOUNT_CLIENT_SECRET"],
      redirect_uri: Rails.env.production? ? "https://game.hackclub.com/auth/hca/callback" : "http://localhost:3100/auth/hca/callback"
    }
end
