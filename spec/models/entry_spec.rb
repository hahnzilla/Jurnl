require 'spec_helper'

describe Entry do
  let(:entry) { FactoryGirl.create(:entry) }

  it "should validate presence of content" do
    entry.content = nil
    entry.valid?.should be false
  end
end
