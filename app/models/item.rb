# == Schema Information
#
# Table name: items
#
#  id           :bigint           not null, primary key
#  black_market :boolean          default(FALSE), not null
#  description  :text             not null
#  featured     :boolean          default(FALSE), not null
#  name         :string           not null
#  one_per_user :boolean          default(FALSE), not null
#  price        :integer          not null
#  stock        :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Item < ApplicationRecord
  INVITE_ID = 3

  has_paper_trail

  has_many :purchases, dependent: :destroy
  has_one_attached :image

  scope :not_black_market, -> { where(black_market: false) }
  scope :black_market, -> { where(black_market: true) }

  def display_hash(stock_left = false)
    hash = self.as_json.slice("id", "description", "name", "price", "featured", "one_per_user", "stock", "black_market")
    if image.attached? && image.persisted?
      hash["image"] = Rails.application.routes.url_helpers.rails_blob_path(image, disposition: :inline)
    end

    if stock_left
      hash["stock_left"] = stock.present? ? stock - purchases.reduce(0) { |acc, p| acc + p.quantity } : 0
    end

    hash
  end
end
