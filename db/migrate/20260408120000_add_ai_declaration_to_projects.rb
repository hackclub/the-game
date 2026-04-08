class AddAiDeclarationToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :projects, :ai_declaration, :text
  end
end
