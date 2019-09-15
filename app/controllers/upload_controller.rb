class UploadController < ApplicationController
  def index
    render component: 'Upload'
  end

  def create
    mobile_app = MobileApp.create(name: upload_params[:name], status: :pending)
    CreateMobileAppService.new(mobile_app, upload_params).call
    render json: {}, status: 200
  end

  private

  def upload_params
    params.permit(:file, :name)
  end
end
