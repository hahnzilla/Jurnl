require 'spec_helper'

feature "Manage Sessions:" do
  let(:user) { FactoryGirl.create(:user) }
  
  scenario "user wants to log in" do
    visit "/users/sign_in"
    fill_in "sign_in_email", with: user.email
    fill_in "sign_in_password", with: user.password
    click_on "Sign In"
    page.current_url.should eq root_url
  end

  scenario "user wants to log out" do
    login! 
    click_on "Sign Out"
    page.current_path.should eq "/users/sign_in"
  end
end
