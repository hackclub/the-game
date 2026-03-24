class ReferralRewardService
  def self.sync_verification(user)
    referral = Referral.find_by(referred_user_id: user.id)
    return unless referral

    unless user.idv_verified?
      referral.update!(shipped: false, raffle_entries: 0) if referral.shipped? || referral.raffle_entries.positive?
      return
    end

    program = ReferralProgram.instance
    raffle_entries = program.active? ? program.referrer_raffle_entries : 0

    referral.update!(shipped: true, raffle_entries:) unless referral.shipped? && referral.raffle_entries == raffle_entries
  end
end
