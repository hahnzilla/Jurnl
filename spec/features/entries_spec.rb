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

  scenario "user wants to view a single entry" do
    visit entry_path(entry)
    page.should have_content entry.content
  end

  scenario "user wants to edit an entry" do
    edited_content = "edited string man thing"
    visit edit_entry_path(entry)
    fill_in "entry_content", with: edited_content
    click_on "Update Entry"
    entry.reload.content.should eq edited_content
  end
end
