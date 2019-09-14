Rails.application.routes.draw do
  resources :users
  resources :mobile_app
  get :upload, to: 'upload#index'
  post :upload, to: 'upload#create'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
