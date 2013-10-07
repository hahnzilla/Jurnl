require 'spec_helper'

feature Entry do
  let!(:entry) { FactoryGirl.create(:entry) }
  before(:each) { login! }

  scenario "user wants to create a new entry" do
    visit new_entry_path
    fill_in "entry_content", with: "Journal Man"
    expect{
      click_on "Create Entry"
    }.to change(Entry, :count).by(1)
  end

  scenario "user wants to view all entries" do
    visit entries_path
    page.should have_content "Donuts"
    page.should have_content entry.content
  end
end
