class ProjectPolicy < ApplicationPolicy
  def show?
    record.user == user || user.admin? || user.reviewer?
  end

  def update?
    user.admin? || user.reviewer? || (record.user == user && !record.submitted?)
  end

  def destroy?
    (record.user == user || user.admin?) && record.reviews.approval.empty?
  end

  def allow_reship?
    user.admin? || user.reviewer? || user.fulfiller?
  end

  alias_method :ship?, :update?
  alias_method :check_repo?, :show?
end
