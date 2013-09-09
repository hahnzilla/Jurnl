class AddColumnsToEntries < ActiveRecord::Migration
  def change
  	change_table :entries do |t|
  		t.integer :word_count
  		t.integer :distraction_count
  		t.integer :duration
  		t.integer :words_per_minute
  		t.integer :user_id
  	end
  end
end
