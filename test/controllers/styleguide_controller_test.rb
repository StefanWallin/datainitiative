require 'test_helper'

class StyleguideControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get typesetting" do
    get :typesetting
    assert_response :success
  end

  test "should get components" do
    get :components
    assert_response :success
  end

end
