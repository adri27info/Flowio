from rest_framework.permissions import BasePermission


class IsAdminOrSelf(BasePermission):
    """
    Permission that allows users to manage only their own profile,
    while administrators can manage any profile.
    """

    def has_permission(self, request, view):
        admin_entities = {"users"}
        user_entities = {"workspaces", "boards"}
        role_id = request.user.role_id.id
        request_path = request.path

        if request.method == "POST":
            if any(entity in request_path for entity in admin_entities):
                return role_id == 1

            if any(entity in request_path for entity in user_entities):
                return role_id == 1 or role_id == 2

        return True

    def has_object_permission(self, request, view, obj):
        if request.user.role_id.id == 1:
            return True

        if request.user == obj:
            return True

        if any(
            hasattr(obj, attr)
            for attr in ["user_id", "workspace_id", "board_id", "list_id"]
        ):
            return True

        return False
