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
  
  describe "search for hash tags" do
    let!(:user_id) { entry.user.id }
    let!(:entry2) { Entry.create(content: "don't return me!", user_id: user_id) }
    context "params contains tag" do
      let(:params) { {q: entry.tags.first.name} }

      context "user_id doesn't match" do
        it "should not return entry" do
          Entry.search(params, -1).should eq []
        end
      end

      context "user_id matches" do
        context "date range is not given" do
          it "should return entries associated with tag" do
            Entry.search(params, user_id).should eq [entry]
          end

          context "params does not contain tag" do
            context "params contains date" do
              let(:params) { {q: entry.created_at.to_s } }

              it "should return entry created on date" do
                entries = Entry.search(params, user_id)
                entries.should include entry
                entries.length.should be 2
              end
            end

            context "params does not contain date" do
              let(:params) { {q: entry.content.split(" ")[15]} }

              context "params includes a word found in an entry" do
                it "should return all entries associated with word" do
                  Entry.search(params, user_id).should eq [entry]
                end
              end

              context "params does not include any words found in entry" do
                let(:params) { {q: ""} }
                it "should return all entries" do
                  Entry.search(params, user_id).should eq Entry.all.reverse
                end
              end
            end
          end

          context "date range is given" do
            let!(:entry3) do
              e = Entry.create(content: "don't return me!", user_id: user_id)
              e.created_at = 410.days.ago 
              e.save
              e
            end

            context "month is given" do
              let(:params) { {q: "", date: { month: entry.created_at.month.to_s }} }
              it "should restrict entries to given month" do
                entries = Entry.search(params, user_id)
                entries.should include entry
                entries.should_not include entry3
                entries.length.should be 2
              end
            end

            context "year is given" do
              let(:params) { {q: "", date: { year: entry.created_at.year.to_s }} }
              it "should restrict entries to given month" do
                entries = Entry.search(params, user_id)
                entries.should include entry
                entries.should_not include entry3
                entries.length.should be 2
              end
            end

            context "both month and year is given" do
              let(:params) { {q: "", date: { month: entry.created_at.month.to_s ,year: entry.created_at.year.to_s }} }
              it "should restrict entries to given month" do
                entries = Entry.search(params, user_id)
                entries.should include entry
                entries.should_not include entry3
                entries.length.should be 2
              end
            end
          end
        end
      end
    end
  end
end
