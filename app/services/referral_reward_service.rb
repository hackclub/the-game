class ReferralRewardService
  def self.process_approval(project)
    user = project.user
    referral = Referral.find_by(referred_user_id: user.id)
    return unless referral
    return if referral.shipped

    program = ReferralProgram.instance
    approved_tickets = (project.approved_seconds.to_i / 3600.0).floor
    return if approved_tickets <= 0

    referrer_tickets = (approved_tickets * program.referrer_bonus_percentage / 100.0).ceil

    ActiveRecord::Base.transaction do
      referral.update!(shipped: true, tickets_awarded: referrer_tickets)

      if referrer_tickets > 0
        TicketAdjustment.create!(
          user: referral.referrer,
          amount: referrer_tickets,
          reason: "Referral bonus: #{user.username || user.email} shipped a project"
        )
      end

      if program.referred_bonus_tickets > 0
        TicketAdjustment.create!(
          user: user,
          amount: program.referred_bonus_tickets,
          reason: "Welcome bonus for shipping your first project via referral"
        )
      end
    end
  end
end
