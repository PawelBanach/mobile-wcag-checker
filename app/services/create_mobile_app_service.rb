class CreateMobileAppService
  def initialize(mobile_app, params)
    @mobile_app = mobile_app
    @params = params
  end

  def call
    binding.pry
    if @params[:file] && !file?(@params[:file])
      binding.pry
      delete_source if @mobile_app.source.attached?
      binding.pry
      @params.delete(:source)
    end

    binding.pry
    @mobile_app.update(source: @params[:file])
  end

  private

  def file?(param)
    param.is_a?(ActionDispatch::Http::UploadedFile)
  end

  def delete_source
    @mobile_app.source.purge
  end
end