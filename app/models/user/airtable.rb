class User
  class Airtable < AirpplicationRecord
    self.table_name = "Users"

    field :email, "Email"
    field :first_name, "First Name"
    field :verification_status, "Verification Status"
    field :hackatime_linked, "Hackatime Linked?"
    field :first_project_created_at, "Loops - hctgFirstProjectCreatedAt"
    field :first_project_ship_at, "Loops - hctgFirstProjectShipAt"
  end
end
