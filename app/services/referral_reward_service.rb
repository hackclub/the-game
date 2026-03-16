class ReferralRewardService
  def self.process_approval(project)
    user = project.user
    referral = Referral.find_by(referred_user_id: user.id)
    return unless referral
    return if referral.shipped

    program = ReferralProgram.instance
    return unless program.active?

    referral.update!(shipped: true, raffle_entries: program.referrer_raffle_entries)
  end
end
