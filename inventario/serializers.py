from rest_framework import serializers
from .models import Equipo, Movimiento

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'  # ✅ Incluye todos tus campos originales + nuevos estados

class MovimientoSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.CharField(source='equipo.nombre', read_only=True)
    class Meta:
        model = Movimiento
        fields = '__all__'