class ChangeFeaturetdDefaultOnItems < ActiveRecord::Migration[8.1]
  def change
    change_column_default :items, :featurted, from: nil, to: false
    change_column_null :items, :featurted, false, false
  end
end
