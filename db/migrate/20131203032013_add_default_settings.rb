class AddDefaultSettings < ActiveRecord::Migration
  def change
    change_column :users, :bg_color_hex, :string, :default => "FFFFFF"
    change_column :users, :font_color_hex, :string, :default => "000000"
    change_column :users, :font_point, :integer, :default => 12
  end
end
