class SettingsController < ApplicationController
  def show
	@settings = User.find(current_user.id)
  end
  
  def create
	render text: params[:user].inspect
  end
  
  def edit
	@settings = User.find(current_user.id)
  end
  
  def update
	@settings = User.find(current_user.id)
	
	if @settings.update(params[:user.id].permit(:bg_color_hex, :font_color_hex))
		redirect_to @settings
	else
		render 'edit'
	end
  end
  
  private
  def setting_params
	params.require(:user).permit(:id)
  end
end
