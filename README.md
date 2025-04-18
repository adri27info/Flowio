# Flowio

Welcome to Flowio, the app where you can create tasks quickly and efficiently.

### Images

![Login](./utils/preview/login_preview.png)

---

![Register](./utils/preview/register_preview.png)

---

![Profile](./utils/preview/profile_preview.png)

---

![Structures 1](./utils/preview/structures_1_preview.png)

---

![Structures 2](./utils/preview/structures_2_preview.png)

---

![Board preview](./utils/preview/board_preview.png)

---

![Creating board](./utils/preview/create_board.png)

---

![Creating workspace](./utils/preview/create_workspace_preview.png)

---

![Workspace](./utils/preview/workspace_preview.png)

---

![Workspace detail](./utils/preview/workspace_detail.png)

---

![Workspace owner](./utils/preview/workspace_owner.png)

---

![Workspace searching](./utils/preview/workspace_search.png)

---

![Board info](./utils/preview/board_info.png)

---

![Board list and cards](./utils/preview/board_workspace.png)

### Features

- Containerized with Docker for easy setup and environment isolation.
- Sending emails when the user registers or wants to obtain another activation code using Celery Signals.
- Storing static files and media using AWS's S3 service.
- Cache and CDN services using AWS's Cloudfront service.
- Invalidating user profile images once they are deleted.
- User authentication using JWT.
- Handling refresh token denials using a blacklist.
- Exception handling on app endpoints.
- Permission and error validations throughout the app.
- 100% responsive design.
- Intuitive search for workspaces and boards.
- Creating, editing, and deleting workspaces.
- Creating, editing, and deleting boards.
- Create, edit, and delete lists and cards.
- Create, edit, delete, and register users in the app.

### Technologies

- VUE
- DJANGO
- BOOTSTRAP
- DOCKER
- AWS (S3, CLOUDFRONT)
- CELERY
- REDIS
- GIT
- HTML
- CSS
- JS

### Installation

For installation and setup instructions, please check the [INSTALLATION](./utils/mds/INSTALLATION.md).

### License

This project is licensed under the MIT License - see the [LICENSE](./utils/licenses/LICENSE) file for details.
