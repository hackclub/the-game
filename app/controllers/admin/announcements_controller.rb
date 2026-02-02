module Admin
  class AnnouncementsController < ApplicationController
    before_action :signed_in_admin
    before_action :set_announcement, only: [ :edit, :update, :destroy ]
    skip_after_action :verify_authorized

    def index
      render inertia: "admin/announcements/index", props: { announcements: Announcement.all.map(&:display_hash) }
    end

    def create
      Announcement.create!(announcement_params.merge(user: current_user))

      redirect_to admin_announcements_path
    end

    def edit
      render inertia: "admin/announcements/edit", props: { announcement: @announcement.display_hash }
    end

    def update
      @announcement.update!(announcement_params)

      redirect_to admin_announcements_path
    end

    def destroy
      @announcement.destroy!

      redirect_to admin_announcements_path
    end

    private

    def announcement_params
      params.require(:announcement).permit(:title, :content)
    end

    def set_announcement
      @announcement = Announcement.find(params[:id])
    end
  end
end
