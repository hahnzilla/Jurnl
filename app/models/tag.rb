class Tag < ActiveRecord::Base
  attr_accessible :entry_id, :name
  belongs_to :entries
end
