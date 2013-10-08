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

require 'spec_helper'

describe Tag do
  it "should validate uniquess of :name scoped by :entry_id" do
    tag = FactoryGirl.create(:tag)
    expect{
      Tag.create(entry_id: tag.entry_id, name: tag.name)
    }.to change(Tag, :count).by(0)
  end
end
