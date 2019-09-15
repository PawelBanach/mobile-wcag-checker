class MobileAppsController < ApplicationController
  def index
    @mobile_apps = MobileApp.all
    render component: 'MobileApps', props: { mobile_apps: @mobile_apps }
  end

  def update
    binding.pry
  end

  def mobile_app_params
    params.permit(:name, :description, :source)
  end
end
