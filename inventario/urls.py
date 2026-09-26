from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import listar_categorias, listar_marcas, listar_ubicaciones, listar_responsables

router = DefaultRouter()
router.register('equipos', views.EquipoViewSet, basename='equipo')
router.register('movimientos', views.MovimientoViewSet, basename='movimiento')
router.register('mantenimientos', views.MantenimientoViewSet, basename='mantenimiento')

urlpatterns = [
    path('', include(router.urls)),
    path('buscar-equipos/', views.buscar_equipos, name='buscar_equipos'),
    path('categorias/', listar_categorias, name='listar_categorias'),
    path('marcas/', listar_marcas, name='listar_marcas'),
    path('ubicaciones/', listar_ubicaciones, name='listar_ubicaciones'),
    path('responsables/', listar_responsables, name='listar_responsables'),
]
    