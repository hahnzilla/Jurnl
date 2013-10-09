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
  
  def self.search param, user_id
    entries_via_hashtag = search_for_hash_tags param, user_id
    return entries_via_hashtag unless entries_via_hashtag.blank?

    entries_via_date = search_for_date param, user_id
    return entries_via_date unless entries_via_date.blank?

    entries_via_keyword = search_for_keyword param, user_id
    return entries_via_keyword unless entries_via_keyword.blank?

    []
  end

  private
    def self.search_for_hash_tags param, user_id
      joins(:tags).where("tags.name = ? AND user_id = ?", param, user_id)
    end

    def self.search_for_date param, user_id
      begin
        parsed_date = Date.parse(param)
      rescue ArgumentError
        return nil
      end

      Entry.where("CAST(created_at AS TEXT) LIKE ? AND user_id = ?", "#{parsed_date}%", user_id)
    end

    def self.search_for_keyword param, user_id
      Entry.where("content LIKE ? AND user_id = ?", "%#{param}%", user_id)
    end

    def find_and_save_tags
      tag_names = content.scan(/(?:\s|^|>)(?:#(?!\d+(?:\s|$)))([\w-]+)(?=\s|$|\.|\?|!|&|,|<)/i).flatten
      tag_names.each { |tag_name| Tag.create(entry_id: self.id, name: tag_name) }
    end
end
