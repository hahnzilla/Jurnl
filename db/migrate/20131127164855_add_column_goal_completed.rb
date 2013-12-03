class AddColumnGoalCompleted < ActiveRecord::Migration
  def change
    add_column :entries, :goal_completed, :boolean, default: false
  end
end
