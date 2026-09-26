from django.db import models

class Equipo(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    marca = models.CharField(max_length=100, null=True, blank=True)
    modelo = models.CharField(max_length=100)
    serial = models.CharField(max_length=100, unique=True, null=True, blank=True)
    categoria = models.CharField(max_length=100, null=True, blank=True)
    ubicacion = models.CharField(max_length=100, null=True, blank=True)
    responsable = models.CharField(max_length=100, null=True, blank=True)
    fecha_registro = models.DateField(auto_now_add=True)
    observaciones = models.TextField(blank=True)

    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('Prestado', 'Prestado'),
        ('En mantenimiento', 'En mantenimiento'),
        ('Dado de baja', 'Dado de baja'),
        ('En uso', 'En uso')
    ]
    estado = models.CharField(max_length=50, choices=ESTADOS, default="Disponible")
    horas_uso = models.PositiveIntegerField(default=0)
    horas_ultimo_mantenimiento = models.PositiveIntegerField(default=0)
    cantidad_mantenimientos = models.PositiveIntegerField(default=0)
    intervalo_mantenimiento = models.PositiveIntegerField(default=500)
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class Movimiento(models.Model):
    TIPOS_MOVIMIENTO = [
        ('Entrada', 'Entrada'),
        ('Salida', 'Salida'),
        ('Préstamo', 'Préstamo'),
        ('Devolución', 'Devolución'),
        ('Cambio responsable', 'Cambio responsable'),
        ('Cambio ubicación', 'Cambio ubicación'),
        ('Mantenimiento', 'Mantenimiento'),
        ('Dado de baja', 'Dado de baja')
    ]

    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='movimientos')
    tipo = models.CharField(max_length=30, choices=TIPOS_MOVIMIENTO)
    descripcion = models.TextField(blank=True, null=True)
    
    responsable_anterior = models.CharField(max_length=100, blank=True, null=True)
    responsable_nuevo = models.CharField(max_length=100, blank=True, null=True)
    ubicacion_anterior = models.CharField(max_length=100, blank=True, null=True)
    ubicacion_nueva = models.CharField(max_length=100, blank=True, null=True)
    estado_anterior = models.CharField(max_length=50, blank=True, null=True)
    estado_nuevo = models.CharField(max_length=50, blank=True, null=True)
    marca_anterior = models.CharField(max_length=100, blank=True, null=True)
    marca_nueva = models.CharField(max_length=100, blank=True, null=True)

    modelo_anterior = models.CharField(max_length=100, blank=True, null=True)
    modelo_nuevo = models.CharField(max_length=100, blank=True, null=True)

    serial_anterior = models.CharField(max_length=100, blank=True, null=True)
    serial_nuevo = models.CharField(max_length=100, blank=True, null=True)

    categoria_anterior = models.CharField(max_length=100, blank=True, null=True)
    categoria_nueva = models.CharField(max_length=100, blank=True, null=True)
    
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} | {self.equipo.nombre} | {self.fecha.strftime('%d/%m/%Y %H:%M')}"


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    class Meta: verbose_name_plural = "Categorías"
    def __str__(self): return self.nombre

class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    def __str__(self): return self.nombre

class Ubicacion(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    def __str__(self): return self.nombre

class Responsable(models.Model):
    nombre = models.CharField(max_length=150, unique=True)
    cargo = models.CharField(max_length=100, blank=True, null=True)
    class Meta: verbose_name_plural = "Responsables"
    def __str__(self): return self.nombre

class Mantenimiento(models.Model):

    TIPOS = [
        ("Preventivo", "Preventivo"),
        ("Correctivo", "Correctivo"),
    ]

    ESTADOS = [
        ("Pendiente", "Pendiente"),
        ("En proceso", "En proceso"),
        ("Finalizado", "Finalizado"),
    ]

    equipo = models.ForeignKey(
        Equipo,
        on_delete=models.CASCADE,
        related_name="mantenimientos"
    )

    tipo = models.CharField(max_length=20, choices=TIPOS)
    estado = models.CharField(max_length=20, choices=ESTADOS, default="Pendiente")

    fecha = models.DateField()
    tecnico = models.CharField(max_length=100)

    descripcion = models.TextField()
    observaciones = models.TextField(blank=True)

    costo = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f"{self.equipo.codigo} - {self.tipo}"