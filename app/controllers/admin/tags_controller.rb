module Admin
  class TagsController < ApplicationController
    before_action :signed_in_admin
    before_action :set_tag, only: [ :edit, :update, :destroy ]
    skip_after_action :verify_authorized

    def index
      tags = Project::Tag.all.map(&:display_hash)

      render inertia: "admin/tags/index", props: { tags: }
    end

    def create
      Project::Tag.create!(tag_params)

      flash[:notice] = "Created #{tag_params[:name]} tag"

      redirect_to admin_tags_path
    end

    def edit
      render inertia: "admin/tags/edit", props: { tag: @tag.display_hash }
    end

    def update
      @tag.update!(tag_params)

      flash[:notice] = "Updated tag"

      redirect_to admin_tags_path
    end

    def destroy
      @tag.destroy!

      flash[:notice] = "Deleted tag"

      redirect_to admin_tags_path
    end

    private

    def tag_params
      params.require(:tag).permit(:name)
    end

    def set_tag
      @tag = Project::Tag.find(params[:id])
    end
  end
end
