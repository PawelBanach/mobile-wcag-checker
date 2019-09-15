class MobileAppsController < ApplicationController
  # only for demo purposes
  skip_before_action :verify_authenticity_token, only: [:update]
  before_action :set_mobile_app

  def index
    @mobile_apps = MobileApp.all
    render component: 'MobileApps', props: { mobile_apps: @mobile_apps }
  end

  def show

    @mobile_app = MobileApp.find(params[:id])
    render component: 'AccessibilityResults', props: { mobile_app: @mobile_app }
  end

  def update
    @mobile_app.update(accessibility: accessibility_param, status: :verified)
  end

  private

  def accessibility_param
    JSON.parse(update_params[:accessibility])
  end

  def update_params
    params.permit(:accessibility, :id)
  end

  def mobile_app_params
    params.permit(:name, :description, :source)
  end

  def set_mobile_app
    @mobile_app ||= MobileApp.last
  end
end
