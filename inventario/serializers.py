from rest_framework import serializers
from .models import Equipo, Movimiento, Mantenimiento


class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = "__all__"


class MovimientoSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.CharField(
        source="equipo.nombre",
        read_only=True
    )

    class Meta:
        model = Movimiento
        fields = "__all__"


class MantenimientoSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.CharField(
        source="equipo.nombre",
        read_only=True
    )

    class Meta:
        model = Mantenimiento
        fields = "__all__"