class ProjectsPolicy < ApplicationPolicy
  attr_reader :user, :project

  def initialize(user, project)
    @user = user
    @projects = project
  end

  def edit
    logged_in? || @user.admin
  end
end
