# == Schema Information
#
# Table name: items
#
#  id          :bigint           not null, primary key
#  description :text             not null
#  featurted   :boolean          default(FALSE), not null
#  name        :string           not null
#  price       :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Item < ApplicationRecord
  has_many :purchases, dependent: :destroy
  has_one_attached :image

  def display_hash
    hash = self.as_json.slice("id", "description", "name", "price", "featurted")

    if image.attached? && image.persisted?
      hash["image"] = Rails.application.routes.url_helpers.rails_blob_path(image, disposition: :inline)
    end

    hash
  end
end
