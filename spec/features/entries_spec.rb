require 'spec_helper'

feature Entry do
  before(:each) { login! }

  scenario "user wants to create a new entry" do
    visit new_entry_path
    fill_in "entry_content", with: "Journal Man"
    expect{
      click_on "Create Entry"
    }.to change(Entry, :count).by(1)
  end

  scenario "user wants to view all entries" do
    entry = FactoryGirl.create(:entry, user_id: @user.id)
    visit entries_path
    page.should have_content "Donuts"
    page.should have_content entry.content
  end

  scenario "user wants to search for an entry", js: true do
    visit entries_path
    tag_name = "foobarbaz"
    entry = FactoryGirl.create(:entry, content: "##{tag_name}", user_id: @user.id)
    fill_in "search", with: tag_name
    find_field('search').native.send_keys(:return)
    page.should have_content entry.content
  end
end
