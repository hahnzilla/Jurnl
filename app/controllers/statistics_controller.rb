class StatisticsController < ApplicationController
  # GET /statistics
  # GET /statistics.json
  def index
    @statistics = Entry.user_entries(current_user.id).stats

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @statistics }
    end
  end

  # GET /statistics/:type
  # GET /statistics/:type.json
  def show
    @statistic = Entry.user_entries(current_user.id).send(params[:type])

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @statistic }
    end
  end
end
