class UsersController < ApplicationController
  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  def readme
    render "readme"
  end
  
  # GET /users/current
  def current
    #entry = Entry.where("cast(created_at as text) like ? AND user_id = ?", "#{Time.zone.today}%", current_user.id).first
    render json: current_user
  end
  
  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        flash[:notice] = "Settings successfully updated!"
        format.html { render "edit" }
        format.json { render json: @user, status: :created, location: @user }
      else
        format.html { render "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end   
end
