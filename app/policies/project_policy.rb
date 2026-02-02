class ProjectPolicy < ApplicationPolicy
  def show?
    record.user == user || user.admin?
  end

  alias_method :update?, :show?
  alias_method :destroy?, :show?
  alias_method :ship?, :show?
end
