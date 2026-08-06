from django.contrib import admin
from django.urls import path, include
from inventario.views import lista_equipos

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inventario.urls')),  # ✅ Mantiene el prefijo api/
    path('', lista_equipos, name='pagina_principal'),  # ✅ Vista HTML en raíz
]