class UsersController < ApplicationController
  def edit
   
    @user = User.find(params[:id])
  end
  
  def update
    @user = User.find(params[:id])
    
    if @user.update_attributes(params[:user])
      redirect_to "/users/#{@user.id}/edit"
    else
      render 'edit'
    end
  end
end
