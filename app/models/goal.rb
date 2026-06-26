# == Schema Information
#
# Table name: goals
#
#  id         :bigint           not null, primary key
#  position   :integer          default(0), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  item_id    :bigint           not null
#
# Indexes
#
#  index_goals_on_item_id  (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.id)
#
class Goal < ApplicationRecord
  belongs_to :item

  scope :ordered, -> { order(:position, :id) }

  def display_hash
    {
      "id" => id,
      "position" => position,
      "item" => item.display_hash
    }
  end
end
