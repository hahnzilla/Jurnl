class Entry < ActiveRecord::Base
  attr_accessible :content, :word_count, :distraction_count, :duration, :words_per_minute, :user_id
  validates_presence_of :content
  belongs_to :user
  has_many :tags
end
