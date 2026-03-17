class AddReferredItemAndOgTemplateToReferralProgram < ActiveRecord::Migration[8.1]
  def change
    add_column :referral_program, :referred_item_id, :bigint
    add_column :referral_program, :og_description_template, :text
    add_foreign_key :referral_program, :items, column: :referred_item_id
  end
end
