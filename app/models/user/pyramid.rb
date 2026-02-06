class User
  class Pyramid < AirpplicationRecord
    self.table_name = "Pyramid"

    field :email, "Email"
    field :referral_code, "Referral Code"
    field :projects_count, "# Projects"
    field :idv_status, "IDV Status"
    field :hours, "Hours"

    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  end
end
