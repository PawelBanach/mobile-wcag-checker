class MobileAppsController < ApplicationController
  def index
    @mobile_apps = MobileApp.all
    # render component: 'Users', props: { users: @users }
    # render json: { hello: "hi" }
  end

  def create

  end

  def mobile_app_params
    params.permit(:name, :description, :source)
  end
end
