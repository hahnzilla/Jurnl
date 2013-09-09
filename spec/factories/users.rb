# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user do
    goal_duration 1
    goal_word_count 1
    bg_color_hex "MyString"
    font_color_hex "MyString"
    font_point 1
  end
end
