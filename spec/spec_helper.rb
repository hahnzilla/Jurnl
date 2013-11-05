
require 'rubygems'

# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'capybara/rspec'
require 'database_cleaner'

RSpec.configure do |config|
  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr
  config.mock_with :rspec

  config.include Devise::TestHelpers, :type => :controller
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  
  #Capybara.javascript_driver = :webkit
  config.use_transactional_fixtures = false
  config.before(:suite)  do
    DatabaseCleaner[:active_record].strategy = :truncation
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) { DatabaseCleaner.start }
  config.after(:suite) { DatabaseCleaner.clean }
  config.after(:each) { DatabaseCleaner.clean }
  

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  config.order = "random"
end

def login!
  @user = FactoryGirl.create(:user)
  visit "/users/sign_in"
  fill_in 'sign_in_email', :with => @user.email
  fill_in 'sign_in_password', :with => @user.password
  click_on 'Sign In'
end

