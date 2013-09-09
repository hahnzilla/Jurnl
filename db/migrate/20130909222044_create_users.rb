class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.integer :goal_duration
      t.integer :goal_word_count
      t.string :bg_color_hex
      t.string :font_color_hex
      t.integer :font_point

      t.timestamps
    end
  end
end
