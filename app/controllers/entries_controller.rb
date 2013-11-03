class EntriesController < ApplicationController
  # GET /entries
  # GET /entries.json
  def index
    if params[:search].blank?
      @entries = Entry.where(user_id: current_user.id).order("created_at desc")
    else
      @entries = Entry.search(params[:search], current_user.id)
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.text { send_data format_entriesTXT(@entries), :filename => "entries.txt" }
    end
  end
  
  #GET /entriesDownload
  def download_html
    if params[:search].blank?
      @entries = Entry.where(user_id: current_user.id).order("created_at desc")
    else
      @entries = Entry.search(params[:search], current_user.id)
    end
    send_data format_entriesHTML(@entries), :filename => "entries.html"
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
    entry = Entry.where("cast(created_at as text) like ?", "#{Time.zone.today}%").first
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

  def update
  @entry=Entry.find(params[:id])
  respond_to do |format|
      if @entry.update_attributes(params[:entry])
        format.json { render json: @entry, status: :created, location: @entry }
      else
        format.json { render json: @entry.errors, status: :unprocessable_entity }
      end
    end
  end
  
  private
  
    def format_entriesTXT entries
      #put logic here to create file with entries
      content = ""
      entries.each do |entry|
        content += entry.content.gsub(%r{</?[^>]+?>}, '') + "\n***\n"
      end
      content
    end
    
    def format_entriesHTML entries
      #put logic here to create file with entries
      content = ""
      entries.each do |entry|
        content += entry.content + "\n***\n"
      end
      content
    end
end

