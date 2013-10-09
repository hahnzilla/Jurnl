require 'factory_girl'
require 'faker'

FactoryGirl.define do
  factory :entry do
    content { ActiveRecord::Base.sanitize Faker::Lorem.paragraphs( 3, false) }

    user
    after(:create) do |entry|
      FactoryGirl.create(:tag, entry_id: entry.id)
    end
  end
end
