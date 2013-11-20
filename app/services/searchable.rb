module Searchable
  def search params, user_id
    %w{hashtag date keyword}.each do |search_type|
      search_output = send("search_for_#{search_type}", params[:q], user_id)
      unless search_output.blank?
        return restrict_date_range(search_output, params[:date]).order("created_at desc")
      end
    end
    []
  end

  private
    def search_for_hashtag param, user_id
      joins(:tags).where("tags.name = ? AND user_id = ?", param, user_id)
    end

    def search_for_date param, user_id
      begin
        parsed_date = Date.parse(param)
      rescue ArgumentError
        return nil
      end

      Entry.where("CAST(created_at AS TEXT) LIKE ? AND user_id = ?", "#{parsed_date}%", user_id)
    end

    def search_for_keyword param, user_id
      Entry.where("content LIKE ? AND user_id = ?", "%#{param}%", user_id)
    end

    #TODO Refactor at some point... kinda looks ugly
    def restrict_date_range(entries, date={})
      unless date.blank?
        where, values = [], []
        unless date[:month].blank?
          where << "to_char(created_at, 'MM') = ?"
          month = single_digit?(date[:month]) ? pad_month(date[:month]) : date[:month]
          values << month
        end

        unless date[:year].blank?
          where << "to_char(created_at, 'YYYY') = ?"
          values << date[:year]
        end

        return entries.where(where.join(" AND "), *values)
      end
      entries
    end

    def pad_month month
    "0#{month}"
    end

    def single_digit? month
      month.to_i < 10
    end

end
