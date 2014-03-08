require 'test_helper'

class DatainitiativeControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get about" do
    get :about
    assert_response :success
  end

  test "should get creator" do
    get :creator
    assert_response :success
  end

  test "should get styleguide" do
    get :styleguide
    assert_response :success
  end

end
