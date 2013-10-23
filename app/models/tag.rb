# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  entry_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Tag < ActiveRecord::Base
  REGEX = /(?:\s|^|>)(?:#(?!\d+(?:\s|$)))([\w-]+)(?=\s|$|\.|\?|!|&|,|<)/i
  attr_accessible :entry_id, :name
  belongs_to :entries
  validates :name, :uniqueness => {:scope => :entry_id}
end
