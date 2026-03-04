class CreateTicketAdjustments < ActiveRecord::Migration[8.1]
  def change
    create_table :ticket_adjustments do |t|
      t.belongs_to :user, null: false
      t.integer :amount, null: false

      t.timestamps
    end
  end
end
