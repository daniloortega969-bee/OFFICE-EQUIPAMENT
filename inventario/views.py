from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# ✅ Importamos todos los modelos
from .models import Equipo, Movimiento, Categoria, Marca, Ubicacion, Responsable
# ✅ Importamos todos los serializadores
from .serializers import EquipoSerializer, MovimientoSerializer


def lista_equipos(request):
    return render(request, 'inventario/lista-equipos.html')


class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        print("\n===== DATOS RECIBIDOS =====")
        print(request.data)
        ser = self.get_serializer(data=request.data)
        if not ser.is_valid():
            print("\n===== ERRORES DE VALIDACIÓN =====")
            print(ser.errors)
            return Response(ser.errors, status=400)
        return super().create(request, *args, **kwargs)

    # ✅ LÓGICA PARA REGISTRAR HISTORIAL AL EDITAR
    def perform_update(self, serializer):
        eq_anterior = self.get_object()
        eq_nuevo = serializer.save()
        cambios = []

        # Cambio de estado
        if eq_anterior.estado != eq_nuevo.estado:
            cambios.append(Movimiento(
                equipo=eq_nuevo,
                tipo='Mantenimiento' if eq_nuevo.estado == 'En mantenimiento' else 'Dado de baja' if eq_nuevo.estado == 'Dado de baja' else 'Préstamo' if eq_nuevo.estado == 'Prestado' else 'Devolución',
                estado_anterior=eq_anterior.estado,
                estado_nuevo=eq_nuevo.estado
            ))

        # Cambio de responsable
        if eq_anterior.responsable != eq_nuevo.responsable:
            cambios.append(Movimiento(
                equipo=eq_nuevo,
                tipo='Cambio responsable',
                responsable_anterior=eq_anterior.responsable,
                responsable_nuevo=eq_nuevo.responsable
            ))

        # Cambio de ubicación
        if eq_anterior.ubicacion != eq_nuevo.ubicacion:
            cambios.append(Movimiento(
                equipo=eq_nuevo,
                tipo='Cambio ubicación',
                ubicacion_anterior=eq_anterior.ubicacion,
                ubicacion_nueva=eq_nuevo.ubicacion
            ))

        # Guardamos todos los cambios detectados
        if cambios:
            Movimiento.objects.bulk_create(cambios)


# ✅ ViewSet para ver el historial completo
class MovimientoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movimiento.objects.all().order_by('-fecha')
    serializer_class = MovimientoSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['GET'])
def buscar_equipos(request):
    nombre = request.GET.get('nombre', '')
    codigo = request.GET.get('codigo', '')
    serial = request.GET.get('serial', '')
    categoria = request.GET.get('categoria', '')
    estado = request.GET.get('estado', '')
    ubicacion = request.GET.get('ubicacion', '')

    equipos = Equipo.objects.all()

    if nombre: equipos = equipos.filter(nombre__icontains=nombre)
    if codigo: equipos = equipos.filter(codigo__icontains=codigo)
    if serial: equipos = equipos.filter(serial__icontains=serial)
    if categoria: equipos = equipos.filter(categoria=categoria)
    if estado: equipos = equipos.filter(estado=estado)
    if ubicacion: equipos = equipos.filter(ubicacion__icontains=ubicacion)

    serializer = EquipoSerializer(equipos, many=True)
    return Response(serializer.data)


# ✅ AHORA SIRVEN PARA LEER Y TAMBIÉN GUARDAR (GET + POST)
@csrf_exempt
def listar_categorias(request):
    if request.method == 'GET':
        return JsonResponse(list(Categoria.objects.values_list('nombre', flat=True)), safe=False)
    if request.method == 'POST':
        datos = json.loads(request.body)
        Categoria.objects.create(nombre=datos['nombre'])
        return JsonResponse({'ok': True})

@csrf_exempt
def listar_marcas(request):
    if request.method == 'GET':
        return JsonResponse(list(Marca.objects.values_list('nombre', flat=True)), safe=False)
    if request.method == 'POST':
        datos = json.loads(request.body)
        Marca.objects.create(nombre=datos['nombre'])
        return JsonResponse({'ok': True})

@csrf_exempt
def listar_ubicaciones(request):
    if request.method == 'GET':
        return JsonResponse(list(Ubicacion.objects.values_list('nombre', flat=True)), safe=False)
    if request.method == 'POST':
        datos = json.loads(request.body)
        Ubicacion.objects.create(nombre=datos['nombre'])
        return JsonResponse({'ok': True})

@csrf_exempt
def listar_responsables(request):
    if request.method == 'GET':
        return JsonResponse(list(Responsable.objects.values_list('nombre', flat=True)), safe=False)
    if request.method == 'POST':
        datos = json.loads(request.body)
        Responsable.objects.create(nombre=datos['nombre'])
        return JsonResponse({'ok': True})