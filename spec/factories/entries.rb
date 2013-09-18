require 'factory_girl'
require 'faker'

FactoryGirl.define do
  factory :entry do
    content { ActiveRecord::Base.sanitize Faker::Lorem.paragraphs( 3, false) }
  end
end
