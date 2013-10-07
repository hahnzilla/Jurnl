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
#

class Entry < ActiveRecord::Base
  attr_accessible :content, :word_count, :distraction_count, :duration, :words_per_minute, :user_id
  validates_presence_of :content

  belongs_to :user
  has_many :tags

  after_save :find_and_save_tags

  private

    def find_and_save_tags
      tag_names = content.scan(/(?:\s|^|>)(?:#(?!\d+(?:\s|$)))([\w-]+)(?=\s|$|<|!|\.|\?)/i).flatten
      tag_names.each { |tag_name| Tag.create(entry_id: self.id, name: tag_name) }
    end
end
