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

  alias_method :ship?, :update?
end
