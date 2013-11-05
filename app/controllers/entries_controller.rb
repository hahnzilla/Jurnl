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
      format.html # index.html.erb
      format.json { render json: @entries }
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
end

