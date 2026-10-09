# cPanel Python entrypoint for UCReCENT backend (Django).
# Place: copy to ~/ucrecent/backend/passenger_wsgi.py (deploy script does this automatically).
# cPanel "Setup Python App" looks for passenger_wsgi.py in the Application root.
import os
import sys

# Ensure backend dir is on sys.path (this file lives in backend/)
APP_DIR = os.path.dirname(__file__)
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
