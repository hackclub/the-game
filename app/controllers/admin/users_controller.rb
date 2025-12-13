module Admin
  class UsersController < BaseController
    def index
      users = User.includes(:projects).order(created_at: :desc).map do |user|
        {
          id: user.id,
          email: user.email,
          username: user.username,
          slack_id: user.slack_id,
          admin: user.admin,
          is_banned: user.is_banned,
          ban_type: user.ban_type,
          last_active: user.last_active,
          created_at: user.created_at,
          projects: user.projects.map { |p| { id: p.id, name: p.name, hackatime_name: p.hackatime_name, repo_url: p.repo_url } }
        }
      end

      render inertia: { users: }
    end

    def edit
      user = User.find(params[:id])
      render inertia: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          slack_id: user.slack_id,
          admin: user.admin,
          is_banned: user.is_banned,
          ban_type: user.ban_type,
          birthday: user.birthday,
          internal_notes: user.internal_notes,
          ysws_verified: user.ysws_verified
        },
        ban_types: User.ban_types.keys
      }
    end

    def update
      user = User.find(params[:id])
      if user.update(user_params)
        redirect_to admin_users_path, notice: "User updated successfully."
      else
        redirect_to edit_admin_user_path(user), alert: user.errors.full_messages.join(", ")
      end
    end

    def new
      render inertia: { ban_types: User.ban_types.keys }
    end

    def create
      user = User.new(user_params)
      if user.save
        redirect_to admin_users_path, notice: "User created successfully."
      else
        redirect_to new_admin_user_path, alert: user.errors.full_messages.join(", ")
      end
    end

    def destroy
      user = User.find(params[:id])
      user.destroy
      redirect_to admin_users_path, notice: "User deleted successfully."
    end

    private

    def user_params
      params.require(:user).permit(:email, :username, :admin, :is_banned, :ban_type, :birthday, :internal_notes, :ysws_verified)
    end
  end
end
