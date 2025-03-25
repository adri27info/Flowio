from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.management import call_command

from apps.users.models import User
from apps.roles.models import Role
from apps.categories.models import Category
from apps.structures.models import Structure
from apps.background_workspaces.models import BackgroundWorkspace


class Command(BaseCommand):
    help = "Create the database, run migrations, and seed initial data, then export to SQL."

    def __init__(self):
        super().__init__()
        self.config_vars()

    def config_vars(self):
        db_config = settings.DATABASES["default"]
        self.db_name = db_config["NAME"]
        self.db_user = db_config["USER"]
        self.db_password = db_config["PASSWORD"]
        self.db_host = db_config["HOST"]
        self.db_port = db_config["PORT"]
        self.cloudfront_domain = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}"

    def handle(self, *args, **kwargs):
        self.execute_migrations()
        self.seed_initial_data()

    def execute_migrations(self):
        self.stdout.write("Running makemigrations...")
        call_command("makemigrations")

        self.stdout.write("Running migrate...")
        call_command("migrate")

    def seed_initial_data(self):
        self.stdout.write("Seeding initial data...")
        self.create_roles()
        self.create_admin()
        self.create_categories()
        self.create_structures()
        self.create_background_workspaces()
        self.stdout.write(self.style.SUCCESS("Database setup and seeding completed!"))

    def create_roles(self):
        roles = ["admin", "user"]

        for role_name in roles:
            role, created = Role.objects.get_or_create(name=role_name)
            if created:
                print(f"Role '{role_name}' created.")
            else:
                print(f"Role '{role_name}' already exists.")

    def create_admin(self):
        admin_role = Role.objects.filter(name="admin").first()
        admin_user, created = User.objects.get_or_create(
            email="admin@gmail.com",
            role_id=admin_role,
            defaults={
                "name": "Admin",
                "surnames": "Flowio",
                "is_superuser": True,
                "is_staff": True,
            },
        )

        if created:
            admin_user.set_password("admin")
            admin_user.save()
            print("Success: Superuser 'admin' created with role 'admin'.")
        else:
            print("Info: Admin user already exists. No changes made.")

    def create_categories(self):
        categories = [
            "business",
            "colors",
            "design",
            "education",
            "engineering",
            "marketing",
            "project_management",
            "remote_work",
        ]

        for category_name in categories:
            category, created = Category.objects.get_or_create(
                name=category_name,
                path=f"{self.cloudfront_domain}/flowio/static/categories/{category_name}/icon/{category_name}.svg",
            )
            if created:
                print(f"Category '{category_name}' created.")
            else:
                print(f"Category '{category_name}' already exists.")

    def create_structures(self):
        categories = Category.objects.all()
        structures = [
            {
                "category": "business",
                "items": [
                    {
                        "title": "Strategic Business Planning",
                        "description": "A structure to help businesses outline their strategic goals and plan for long-term success.",
                        "path": "",
                    },
                    {
                        "title": "Business Growth Strategy",
                        "description": "A guide to developing a plan for growing your business across multiple channels.",
                        "path": "",
                    },
                    {
                        "title": "Financial Management",
                        "description": "A structure for tracking business finances, setting budgets, and measuring profitability.",
                        "path": "",
                    },
                    {
                        "title": "Marketing Campaign Overview",
                        "description": "A blueprint for managing your next big marketing campaign with clear goals and KPIs.",
                        "path": "",
                    },
                    {
                        "title": "Team Collaboration",
                        "description": "A structure for organizing team projects and ensuring smooth collaboration in business environments.",
                        "path": "",
                    },
                ],
            },
            {
                "category": "colors",
                "items": [
                    {
                        "title": "Lily Meadow",
                        "description": "A soft and vibrant gradient blending peachy pink and lavender, evoking the tranquility of a blooming meadow.",
                        "path": "",
                    },
                    {
                        "title": "Grass Shampoo",
                        "description": "A refreshing mix of green and blue, reminiscent of morning dew on a grassy field.",
                        "path": "",
                    },
                    {
                        "title": "Juicy Cake",
                        "description": "A lively combination of warm and cool tones, bringing to mind the sweetness of a fruity dessert.",
                        "path": "",
                    },
                    {
                        "title": "African Field",
                        "description": "A warm, earthy gradient inspired by the rich tones of a sunset over an African savannah.",
                        "path": "",
                    },
                    {
                        "title": "Faraway River",
                        "description": "A soothing mix of blue and green hues, reflecting the calmness of a distant flowing river.",
                        "path": "",
                    },
                ],
            },
            {
                "category": "design",
                "items": [
                    {
                        "title": "Minimalist Layout",
                        "description": "A simple, clean design structure focused on minimalism and user experience.",
                        "path": "",
                    },
                    {
                        "title": "Web Design Wireframe",
                        "description": "A structure for designing the wireframe structure of a modern, responsive website.",
                        "path": "",
                    },
                    {
                        "title": "Mobile App Design",
                        "description": "A structure for creating user-friendly and aesthetically pleasing mobile application designs.",
                        "path": "",
                    },
                    {
                        "title": "Brand Identity Guidelines",
                        "description": "A structure for maintaining consistency in design across brand materials and platforms.",
                        "path": "",
                    },
                    {
                        "title": "Product Packaging",
                        "description": "A design structure focused on packaging products with eye-catching and brand-consistent styles.",
                        "path": "",
                    },
                ],
            },
            {
                "category": "education",
                "items": [
                    {
                        "title": "Lesson Plan structure",
                        "description": "A structured structure to organize lesson plans and ensure effective teaching.",
                        "path": "",
                    },
                    {
                        "title": "Study Schedule",
                        "description": "A time management structure for creating a study schedule and staying on track.",
                        "path": "",
                    },
                    {
                        "title": "Course Outline",
                        "description": "A structure for outlining course objectives, topics, and assessment strategies.",
                        "path": "",
                    },
                    {
                        "title": "Classroom Activities",
                        "description": "A structure to organize interactive activities for student engagement and learning.",
                        "path": "",
                    },
                    {
                        "title": "Homework Tracker",
                        "description": "A simple tool to track students’ homework assignments and submission dates.",
                        "path": "",
                    },
                ],
            },
            {
                "category": "engineering",
                "items": [
                    {
                        "title": "Project Timeline",
                        "description": "A detailed structure to manage engineering project timelines and milestones.",
                        "path": "",
                    },
                    {
                        "title": "Engineering Design Checklist",
                        "description": "A checklist to ensure all design requirements are met before proceeding with engineering projects.",
                        "path": "",
                    },
                    {
                        "title": "Risk Assessment",
                        "description": "A structure to assess risks and identify mitigation strategies in engineering projects.",
                        "path": "",
                    },
                    {
                        "title": "Material Inventory",
                        "description": "A tool for tracking materials needed for engineering projects, ensuring timely procurement.",
                        "path": "",
                    },
                    {
                        "title": "Engineering Specifications",
                        "description": "A structure for documenting technical specifications and requirements in engineering design.",
                        "path": "",
                    },
                ],
            },
            {
                "category": "marketing",
                "items": [
                    {
                        "title": "Marketing Plan",
                        "description": "A comprehensive structure for building a strategic marketing plan with measurable goals.",
                        "path": "",
                    },
                    {
                        "title": "Social Media Calendar",
                        "description": "A structure for organizing and scheduling social media content to maintain consistent engagement.",
                        "path": "",
                    },
                    {
                        "title": "Brand Strategy",
                        "description": "A detailed structure to outline your brand’s vision, mission, and core values.",
                        "path": "",
                    },
                    {
                        "title": "Content Marketing",
                        "description": "A structure to create engaging and effective content for attracting and retaining customers.",
                        "path": "",
                    },
                    {
                        "title": "Email Campaign",
                        "description": "A guide to creating compelling email marketing campaigns that drive conversions.",
                        "path": "",
                    },
                ],
            },
            {
                "category": "project_management",
                "items": [
                    {
                        "title": "Project Planning",
                        "description": "A structure to help you plan, track, and execute successful projects from start to finish.",
                        "path": "",
                    },
                    {
                        "title": "Task Management",
                        "description": "A tool to track tasks, prioritize, and allocate resources effectively within a project.",
                        "path": "",
                    },
                    {
                        "title": "Gantt Chart",
                        "description": "A visual representation of the project timeline, with dependencies and milestones.",
                        "path": "",
                    },
                    {
                        "title": "Team Roles",
                        "description": "A structure to assign roles and responsibilities within a project team.",
                        "path": "",
                    },
                    {
                        "title": "Project Risk Management",
                        "description": "A structure to identify and mitigate risks that may affect the project’s success.",
                        "path": "",
                    },
                ],
            },
            {
                "category": "remote_work",
                "items": [
                    {
                        "title": "Remote Work Schedule",
                        "description": "A structure to organize your work hours and tasks while working remotely.",
                        "path": "",
                    },
                    {
                        "title": "Virtual Team Collaboration",
                        "description": "A guide for collaborating efficiently with remote teams using digital tools.",
                        "path": "",
                    },
                    {
                        "title": "Work-from-Home Checklist",
                        "description": "A structure for ensuring that you have the necessary equipment and conditions for remote work.",
                        "path": "",
                    },
                    {
                        "title": "Remote Job Application",
                        "description": "A structure for applying to remote jobs with relevant experience and skills.",
                        "path": "",
                    },
                    {
                        "title": "Online Meeting Agenda",
                        "description": "A structure to structure and organize virtual meetings with your remote team.",
                        "path": "",
                    },
                ],
            },
        ]

        for category in categories:
            total_images = 5
            images = []

            for i in range(1, total_images + 1):
                image_name = f"{self.cloudfront_domain}/flowio/static/categories/{category.name}/{category.name}_{i}.jpg"
                images.append(image_name)

            for structure_name in structures:
                category_name = structure_name["category"]

                if category_name == category.name:
                    for index, struc in enumerate(structure_name["items"]):
                        title = struc["title"]
                        description = struc["description"]
                        struc["path"] = (
                            f"{self.cloudfront_domain}/flowio/static/categories/{category_name}/{category_name}_{index + 1}.jpg"
                        )

                        structure_obj, created = Structure.objects.get_or_create(
                            category_id=category,
                            title=title,
                            description=description,
                            path=struc["path"],
                        )
                        if created:
                            print(
                                f"Structure '{title}' created and assigned to '{category_name}' category with path '{struc['path']}'."
                            )
                        else:
                            print(
                                f"Structure '{title}' already exists in the '{category_name}' category with path '{struc['path']}'."
                            )

    def create_background_workspaces(self):
        background_workspaces = [
            "linear-gradient(to left, #89216b, #da4453)",
            "linear-gradient(to left, #3c1053, #ad5389)",
            "linear-gradient(to left, #3f2b96, #a8c0ff)",
            "linear-gradient(to left, #dd1818, #333333)",
            "linear-gradient(to left, #38ef7d, #11998e)",
            "linear-gradient(to left, #f7b733, #fc4a1a)",
            "linear-gradient(to left, #ed8f03, #ffb75e)",
        ]

        for gradient in background_workspaces:
            background_workspace, created = BackgroundWorkspace.objects.get_or_create(
                gradient_theme=gradient
            )

            if created:
                print(f"BackgroundWorkspace with gradient '{gradient}' created.")
            else:
                print(f"BackgroundWorkspace with gradient '{gradient}' already exists.")
