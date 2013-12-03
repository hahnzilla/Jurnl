class EntriesController < ApplicationController
  # GET /entries
  # GET /entries.json
  def index
    if params[:search].blank?
      @entries = Entry.where(user_id: current_user.id).order("created_at desc")
    else
      @search = params[:search]
      @entries = Entry.search(params[:search], current_user.id)
    end

    respond_to do |format|
      format.html { @entries = @entries.page(params[:page]) }
      format.js { @entries = @entries.page(params[:page]) }
      format.download_html { send_data format_as_html(@entries), filename: "entries.html" }
      format.download_text { send_data format_as_text(@entries), filename: "entries.txt" }
    end
  end
  
  # GET /entries/1
  # GET /entries/1.json
  def show
    @entry = Entry.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @entry }
    end
  end

  # GET /entries/current
  def current
    entry = Entry.where("cast(created_at as text) like ? AND user_id = ?", "#{Time.zone.today}%", current_user.id).first
    render json: entry
  end

  # POST /entries
  # POST /entries.json
  def create
    @entry = Entry.new(params[:entry])

    respond_to do |format|
      if @entry.save
        format.html { redirect_to entries_path, notice: 'Entry was successfully created.' }
        format.json { render json: @entry, status: :created, location: @entry }
      else
        format.html { render action: "new" }
        format.json { render json: @entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /entries/1
  # PUT /entries/1.json
  def update
    @entry = Entry.find(params[:id])

    respond_to do |format|
      if @entry.update_attributes(params[:entry])
        format.json { render json: @entry, status: :created, location: @entry }
      else
        format.json { render json: @entry.errors, status: :unprocessable_entity }
      end
    end
  end
  
  private
  
    def format_as_text entries
      #put logic here to create file with entries
      entries.map{|e| "***\n\n" + e.created_at.strftime("%F") + "\n\n" + e.content.gsub(%r{</?[^>]+?>}, '')}.join("\n\n")
    end
    
    def format_as_html entries
      #put logic here to create file with entries
      string = "<html>\n\n<head></head>\n\n<body>\n\n"
      entries.each do |e| 
        string += "<div>\n\n" + e.created_at.strftime("%F") + "\n\n" + e.content + "\n\n</div>\n\n"
      end	
      string += "</body>\n\n</html>"
    end
end

