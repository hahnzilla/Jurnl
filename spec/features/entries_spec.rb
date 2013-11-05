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
    page.should have_content "jurnl"
    page.should have_content entry.content
  end

  scenario "user wants to search for an entry via hitting return", js: true do
    visit entries_path
    tag_name = "foobarbaz"
    entry = FactoryGirl.create(:entry, content: "##{tag_name}", user_id: @user.id)
    fill_in "search_q", with: tag_name
    find_field('search_q').native.send_keys(:return)
    page.should have_content entry.content
  end

  scenario "user wants to search for an entry via clicking search", js: true do
    visit entries_path
    tag_name = "foobarbaz"
    entry = FactoryGirl.create(:entry, content: "##{tag_name}", user_id: @user.id)
    fill_in "search_q", with: tag_name
    click_on "Search"
    page.should have_content entry.content
  end
end
