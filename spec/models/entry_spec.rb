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
      [" #exampletag.", "#example_tag!", ">#example-tag<", "#example-tag?","#example-tag,", "#example&nbsp"].each do |tag|
        it "should save tag: #{tag}" do
          entry = Entry.create(content: "test #{tag} test")
          entry.reload.tags.first.name.should eq tag.gsub(/>|<|\?|\.|!|\s|#|,|&nbsp/, "")
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
  
  describe "search_for_hash_tags" do
    let!(:user_id) { entry.user.id }
    let!(:entry2) { Entry.create(content: "don't return me!", user_id: user_id) }
    context "param contains tag" do
      let(:param) { entry.tags.first.name }

      context "user_id doesn't match" do
        it "should not return entry" do
          Entry.search(param, -1).should eq []
        end
      end

      context "user_id matches" do
        it "should return entries associated with tag" do
          Entry.search(param, user_id).should eq [entry]
        end

        context "param does not contain tag" do
          context "param contains date" do
            let(:param) { entry.created_at.to_s }

            it "should return entry created on date" do
              entries = Entry.search(param, user_id)
              entries.should include entry
              entries.length.should be 2
            end
          end

          context "param does not contain date" do
            let(:param) { entry.content.split(" ")[15] }

            context "param includes a word found in an entry" do
              it "should return all entries associated with word" do
                Entry.search(param, user_id).should eq [entry]
              end
            end

            context "param does not include any words found in entry" do
              let(:param) { "" }
              it "should return all entries" do
                Entry.search(param, user_id).should eq Entry.all
              end
            end
          end
        end
      end
    end
  end
end
