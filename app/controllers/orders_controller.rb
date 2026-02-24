class OrdersController < ApplicationController
  before_action :signed_in_admin
  skip_after_action :verify_authorized
  


end
