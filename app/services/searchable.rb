module Searchable
  def search param, user_id
    %w{hashtag date keyword}.each do |search_type|
      search_output = send("search_for_#{search_type}", param, user_id)
      return search_output unless search_output.blank?
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
end
