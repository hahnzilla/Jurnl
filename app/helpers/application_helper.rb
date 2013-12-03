module ApplicationHelper
  def parseForDate(date)
    date.utc.in_time_zone("Central Time (US & Canada)").strftime("%B %-d, %Y")
  end

  def parseForTime(date)
    date.utc.in_time_zone("Central Time (US & Canada)").strftime("%l:%M %p")
  end
end
