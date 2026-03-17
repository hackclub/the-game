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
#  stock        :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Item < ApplicationRecord
  acts_as_paranoid
  has_many :purchases, dependent: :destroy
  has_one_attached :image

  def display_hash
    hash = self.as_json.slice("id", "description", "name", "price", "featured", "deleted_at")
    if image.attached? && image.persisted?
      hash["image"] = Rails.application.routes.url_helpers.rails_blob_path(image, disposition: :inline)
    end

    hash
  end
end
