class AddProcessingAtToPurchase < ActiveRecord::Migration[8.1]
  def change
    add_column :purchases, :processing_at, :datetime
  end
end
