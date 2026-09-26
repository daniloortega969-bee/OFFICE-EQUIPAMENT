from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# ✅ Importamos todos los modelos
from .models import (
    Equipo,
    Movimiento,
    Mantenimiento,
    Categoria,
    Marca,
    Ubicacion,
    Responsable,
)
# ✅ Importamos todos los serializadores
from .serializers import (
    EquipoSerializer,
    MovimientoSerializer,
    MantenimientoSerializer,
)


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
                tipo='Mantenimiento' if eq_nuevo.estado == 'En mantenimiento'
                else 'Dado de baja' if eq_nuevo.estado == 'Dado de baja'
                else 'Préstamo' if eq_nuevo.estado == 'Prestado'
                else 'Devolución',
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

        # Cambio de marca
        if eq_anterior.marca != eq_nuevo.marca:
            cambios.append(Movimiento(
                equipo=eq_nuevo,
                tipo='Cambio marca',
                marca_anterior=eq_anterior.marca,
                marca_nueva=eq_nuevo.marca
            ))

        # Cambio de modelo
        if eq_anterior.modelo != eq_nuevo.modelo:
            cambios.append(Movimiento(
                equipo=eq_nuevo,
                tipo='Cambio modelo',
                modelo_anterior=eq_anterior.modelo,
                modelo_nuevo=eq_nuevo.modelo
            ))

        # Cambio de serial
        if eq_anterior.serial != eq_nuevo.serial:
            cambios.append(Movimiento(
                equipo=eq_nuevo,
                tipo='Cambio serial',
                serial_anterior=eq_anterior.serial,
                serial_nuevo=eq_nuevo.serial
            ))

        # Cambio de categoría
        if eq_anterior.categoria != eq_nuevo.categoria:
            cambios.append(Movimiento(
                equipo=eq_nuevo,
                tipo='Cambio categoría',
                categoria_anterior=eq_anterior.categoria,
                categoria_nueva=eq_nuevo.categoria
            ))

        # Guardar todos los cambios detectados
        if cambios:
            Movimiento.objects.bulk_create(cambios)


# ✅ ViewSet para ver el historial completo
class MovimientoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movimiento.objects.all().order_by('-fecha')
    serializer_class = MovimientoSerializer
    permission_classes = [permissions.AllowAny]

class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all().order_by("-fecha")
    serializer_class = MantenimientoSerializer
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



@csrf_exempt
def listar_categorias(request):

    if request.method == "GET":
        categorias = list(Categoria.objects.values("id", "nombre"))
        return JsonResponse(categorias, safe=False)

    elif request.method == "POST":
        datos = json.loads(request.body)

        nombre = datos["nombre"].strip()

        if Categoria.objects.filter(nombre__iexact=nombre).exists():
            return JsonResponse({
                "ok": False,
                "mensaje": "La categoría ya existe."
            })

        Categoria.objects.create(nombre=nombre)

        return JsonResponse({"ok": True})

    elif request.method == "PUT":
        datos = json.loads(request.body)

        categoria = Categoria.objects.get(id=datos["id"])
        categoria.nombre = datos["nombre"].strip()
        categoria.save()

        return JsonResponse({"ok": True})

    elif request.method == "DELETE":
        datos = json.loads(request.body)

        Categoria.objects.filter(id=datos["id"]).delete()

        return JsonResponse({"ok": True})

@csrf_exempt
def listar_marcas(request):

    if request.method == "GET":
        marcas = list(Marca.objects.values("id", "nombre"))
        return JsonResponse(marcas, safe=False)

    elif request.method == "POST":
        datos = json.loads(request.body)

        nombre = datos["nombre"].strip()

        if Marca.objects.filter(nombre__iexact=nombre).exists():
            return JsonResponse({
                "ok": False,
                "mensaje": "La marca ya existe."
            })

        Marca.objects.create(nombre=nombre)

        return JsonResponse({"ok": True})

    elif request.method == "PUT":
        datos = json.loads(request.body)

        marca = Marca.objects.get(id=datos["id"])
        marca.nombre = datos["nombre"].strip()
        marca.save()

        return JsonResponse({"ok": True})

    elif request.method == "DELETE":
        datos = json.loads(request.body)

        Marca.objects.filter(id=datos["id"]).delete()

        return JsonResponse({"ok": True})
    
@csrf_exempt
def listar_ubicaciones(request):

    if request.method == "GET":
        ubicaciones = list(Ubicacion.objects.values("id", "nombre"))
        return JsonResponse(ubicaciones, safe=False)

    elif request.method == "POST":
        datos = json.loads(request.body)

        nombre = datos["nombre"].strip()

        if Ubicacion.objects.filter(nombre__iexact=nombre).exists():
            return JsonResponse({
                "ok": False,
                "mensaje": "La ubicación ya existe."
            })

        Ubicacion.objects.create(nombre=nombre)

        return JsonResponse({"ok": True})

    elif request.method == "PUT":
        datos = json.loads(request.body)

        ubicacion = Ubicacion.objects.get(id=datos["id"])
        ubicacion.nombre = datos["nombre"].strip()
        ubicacion.save()

        return JsonResponse({"ok": True})

    elif request.method == "DELETE":
        datos = json.loads(request.body)

        Ubicacion.objects.filter(id=datos["id"]).delete()

        return JsonResponse({"ok": True})

@csrf_exempt
def listar_responsables(request):

    if request.method == "GET":
        responsables = list(Responsable.objects.values("id", "nombre"))
        return JsonResponse(responsables, safe=False)

    elif request.method == "POST":
        datos = json.loads(request.body)

        nombre = datos["nombre"].strip()

        if Responsable.objects.filter(nombre__iexact=nombre).exists():
            return JsonResponse({
                "ok": False,
                "mensaje": "El responsable ya existe."
            })

        Responsable.objects.create(nombre=nombre)

        return JsonResponse({"ok": True})

    elif request.method == "PUT":
        datos = json.loads(request.body)

        responsable = Responsable.objects.get(id=datos["id"])
        responsable.nombre = datos["nombre"].strip()
        responsable.save()

        return JsonResponse({"ok": True})

    elif request.method == "DELETE":
        datos = json.loads(request.body)

        Responsable.objects.filter(id=datos["id"]).delete()

        return JsonResponse({"ok": True})