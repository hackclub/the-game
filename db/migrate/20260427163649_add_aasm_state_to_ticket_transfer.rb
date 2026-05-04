class AddAasmStateToTicketTransfer < ActiveRecord::Migration[8.1]
  def change
    add_column :ticket_transfers, :aasm_state, :string, null: false
    add_column :ticket_transfers, :approved_at, :datetime
    add_column :ticket_transfers, :rejected_at, :datetime
  end
end
