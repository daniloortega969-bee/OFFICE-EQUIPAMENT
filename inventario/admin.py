from django.contrib import admin
from .models import Equipo, Movimiento, Categoria, Marca, Ubicacion, Responsable

@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nombre', 'categoria', 'estado', 'ubicacion']
    search_fields = ['nombre', 'codigo']
    list_filter = ['estado', 'categoria', 'ubicacion']

@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ['fecha', 'equipo', 'tipo']

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']

@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']

@admin.register(Ubicacion)
class UbicacionAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']

@admin.register(Responsable)
class ResponsableAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'cargo']
    search_fields = ['nombre', 'cargo']