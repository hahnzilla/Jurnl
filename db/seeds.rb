# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
require 'factory_girl_rails'

FactoryGirl.create(:user) if User.all.empty?
5.times { FactoryGirl.create(:entry) }
