# == Schema Information
#
# Table name: items
#
#  id           :bigint           not null, primary key
#  description  :text             not null
#  featured     :boolean          default(FALSE), not null
#  name         :string           not null
#  one_per_user :boolean          default(FALSE), not null
#  price        :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Item < ApplicationRecord
  INVITE_ID = 3

  has_many :purchases, dependent: :destroy
  has_one_attached :image

  def display_hash
    hash = self.as_json.slice("id", "description", "name", "price", "featured", "one_per_user")

    if image.attached? && image.persisted?
      hash["image"] = Rails.application.routes.url_helpers.rails_blob_path(image, disposition: :inline)
    end

    hash
  end
end
