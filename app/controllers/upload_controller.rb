class UploadController < ApplicationController
  def index
    render component: 'Upload'# , props: { users: @users }
    # render json: { hello: "hi" }
  end

  def create
    binding.pry
    render json: {}, status: 200
  end
end
