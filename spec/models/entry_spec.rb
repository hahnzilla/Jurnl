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

  context "after_save" do
    context "tags that should be found" do
      [" #exampletag.", "#example_tag!", ">#example-tag<", "#example-tag?" ].each do |tag|
        it "should save tag: #{tag}" do
          entry = Entry.create(content: "test #{tag} test")
          entry.reload.tags.first.name.should eq tag.gsub(/>|<|\?|\.|!|\s|#/, "")
        end
      end
    end
    
    context "tags that should not be found" do
      ["#5", "#tag#tag", "link.com#id", "test#tagtest"].each do |tag|
        it "should not save tag in this string: #{tag}" do
          expect{
            Entry.create(content: tag) 
          }.to change(Tag, :count).by(0)
        end
      end
    end
  end
end
