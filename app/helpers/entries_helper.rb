module EntriesHelper
  def monthnames
    months = Date::MONTHNAMES.dup
    months.delete(nil)
    months.map{|x| [x,Date::MONTHNAMES.index(x)]}
  end

  def date_searched? search
    search && search[:date] && !search[:date][:month].blank?
  end
end
