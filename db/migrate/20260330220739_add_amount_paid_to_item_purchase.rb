class AddAmountPaidToItemPurchase < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :amount_paid, :integer

    reversible do |direction|
      direction.up do
        Item::Purchase.with_deleted.find_each do |purchase|
          purchase.recover
          purchase.update!(amount_paid: purchase.item.price * purchase.quantity)
          purchase.delete
        end
      end
    end

    change_column_null :item_purchases, :amount_paid, false
  end
end
