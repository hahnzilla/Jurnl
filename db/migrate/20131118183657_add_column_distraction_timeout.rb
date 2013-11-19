class AddColumnDistractionTimeout < ActiveRecord::Migration
  def change
	add_column :users, :distraction_timeout, :integer, default: 180
  end
end
