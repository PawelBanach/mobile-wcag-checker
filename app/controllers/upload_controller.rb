class UploadController < ApplicationController
  def index
    render component: 'Upload'# , props: { users: @users }
    # render json: { hello: "hi" }
  end

  def create
    binding.pry
    mobile_app = MobileApp.create(name: "Some App", description: "Test")
    binding.pry
    CreateMobileAppService.new(mobile_app, upload_params).call
    render json: {}, status: 200
  end

  private

  def upload_params
    params.permit(:file)
  end
end
