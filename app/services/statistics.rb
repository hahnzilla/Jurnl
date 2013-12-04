require 'html/sanitizer'

# This module acts as an extension to ActiveRecord::Relation
module Statistics
  class ActiveRecord::Relation
    def stats
      stats = {}
      %w{word_count distraction_count duration words_per_minute}.each do |stat|
        stats[stat.to_sym] = {}
        %w{min max avg}.each do |type|
          stats[stat.to_sym][type.to_sym] = send "#{type}_#{stat}"
        end
      end
      stats
    end

    def method_missing method_sym
      method = method_sym.to_s
      if method =~ /^min_/
        minimum method[4..-1]
      elsif method =~ /^max_/
        maximum method[4..-1]
      elsif method =~ /^avg_/
        average(method[4..-1]).to_i
      else
        super 
      end
    end

    def most_commonly_used_words
      content = get_all_content
      words = extract_words_from_content(content)
      words_and_count = get_words_and_count(words)
      sort_count_desc(words_and_count)[0..9]
    end

    private 
      def get_all_content
        map{|e| e.content}
      end

      def extract_words_from_content content
        sanitize_content(content.join(" ")).split(/\s/)
      end

      def sanitize_content content
        content.gsub!("\n","").gsub!("&nbsp;")
        HTML::FullSanitizer.new.sanitize content
      end

      def get_words_and_count words
        words.inject(Hash.new(0)) {|counts, word| counts[word] += 1; counts }
      end

      def sort_count_desc words_and_count
        words_and_count.sort_by{|_,value| -value} 
      end
  end
end

