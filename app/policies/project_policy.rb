class ProjectPolicy < ApplicationPolicy
  def show?
    record.user == user || user.admin?
  end

  def update?
    user.admin? || (record.user == user && !record.submitted?)
  end

  alias_method :destroy?, :show?
  alias_method :ship?, :update?
end
