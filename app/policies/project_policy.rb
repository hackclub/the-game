class ProjectPolicy < ApplicationPolicy
  def show?
    record.user == user || user.admin? || user.reviewer?
  end

  def update?
    user.admin? || user.reviewer? || (record.user == user && !record.submitted?)
  end

  alias_method :destroy?, :show?
  alias_method :ship?, :update?
end
