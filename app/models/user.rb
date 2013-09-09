class User < ActiveRecord::Base
  attr_accessible :bg_color_hex, :font_color_hex, :font_point, :goal_duration, :goal_word_count
  has_many :entries
end
