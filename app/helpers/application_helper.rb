module ApplicationHelper

	def parseForDate(date)
		date.strftime("%B %-d, %Y")
	end

	def parseForTime(date)
		date.strftime("%l:%M %p")
	end
	
end