module UsersHelper
  def possible_font_points
    %w{6 7 8 9 10 11 12 14 16 18 24 28 32 40 62}.map{|x| [x,x]}
  end
end
