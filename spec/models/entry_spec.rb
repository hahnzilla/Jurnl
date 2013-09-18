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

require 'spec_helper'

describe Entry do
  let(:entry) { FactoryGirl.create(:entry) }

  it "should validate presence of content" do
    entry.content = nil
    entry.valid?.should be false
  end
end
