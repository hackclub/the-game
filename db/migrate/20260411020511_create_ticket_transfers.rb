class CreateTicketTransfers < ActiveRecord::Migration[8.1]
  def change
    create_table :ticket_transfers do |t|
      t.integer :amount, null: false

      t.references :from_user, null: false
      t.references :to_user, null: false

      t.timestamps
    end
  end
end
