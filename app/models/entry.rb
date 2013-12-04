# == Schema Information
#
# Table name: entries
#
#  id                :integer          not null, primary key
#  content           :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  word_count        :integer
#  distraction_count :integer
#  duration          :integer
#  words_per_minute  :integer
#  user_id           :integer
#  goal_completed    :boolean
#

class Entry < ActiveRecord::Base
  include Statistics
  extend Searchable
  self.per_page = 10
  attr_accessible :content, :word_count, :distraction_count, :duration, :words_per_minute, :user_id, :goal_completed

  belongs_to :user
  has_many :tags

  after_save :find_and_save_tags

  validates_presence_of :content

  scope :user_entries, ->(user_id) { where("user_id = ?", user_id) }

  private
    #TODO add tags as an array datatype so we can avoid deletion everytime
    def find_and_save_tags
      self.tags.destroy_all
      self.content.scan(Tag::REGEX).flatten
        .each{ |tag_name| Tag.create(entry_id: self.id, name: tag_name) }
    end
end
