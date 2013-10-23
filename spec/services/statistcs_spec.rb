require 'spec_helper'

describe Statistics do
  %w{word_count distraction_count duration words_per_minute}.each do |stat|
    describe "entry #{stat}" do
      let!(:max) { FactoryGirl.create(:entry, stat => 1000, user_id: 1) }
      let!(:min) { FactoryGirl.create(:entry, stat => 100, user_id: 1) }
      let!(:avg) { FactoryGirl.create(:entry, stat => 550, user_id: 1) }

      it ".min_#{stat} should find min" do
        Entry.user_entries(1).send("min_#{stat}").should eq min.send(stat)
      end
      
      it ".max_#{stat} should find max" do
        Entry.user_entries(1).send("max_#{stat}").should eq max.send(stat)
      end

      it ".avg_#{stat} should find avg" do
        Entry.user_entries(1).send("avg_#{stat}").should eq avg.send(stat)
      end
    end
  end

  describe "most commonly used words" do
    it "should return a multi-dimensional array ordered by count in desc order" do
      string = "gem gem gem man man egotistical"
      FactoryGirl.create(:entry, content: string, user_id: 1)
      output = Entry.user_entries(1).most_commonly_used_words
      output.should eq [["gem",3],["man",2],["egotistical",1]]
    end
  end
end
