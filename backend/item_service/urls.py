from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.views.static import serve
from django.conf import settings
from pathlib import Path
import os

urlpatterns = [
    path('', lambda request: redirect('/api/')),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Correct path
]

# Serve favicon
if settings.DEBUG:
    urlpatterns += [
        path('favicon.ico', lambda request: serve(request, 'favicon.ico', document_root=os.path.join(settings.BASE_DIR, 'static'))),
    ]

