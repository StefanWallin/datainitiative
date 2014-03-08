Datainitiative::Application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # Main view routes
  get "about" => 'datainitiative#about'
  get "creator" => 'datainitiative#creator'

  # Style guide routes
  get "sg/" => 'styleguide#index'
  get "sg/typesetting" => 'styleguide#typesetting'
  get "sg/components" => 'styleguide#components'

  # You can have the root of your site routed with "root"
  root 'datainitiative#index'

end
