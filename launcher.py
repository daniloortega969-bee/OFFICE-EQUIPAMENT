import os
import sys
import time
import threading
import webbrowser

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# Evita problemas cuando el .exe se ejecuta sin consola
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w")

if sys.stderr is None:
    sys.stderr = open(os.devnull, "w")

import django
django.setup()


def iniciar_servidor():
    from django.core.management import call_command

    call_command(
        "runserver",
        "127.0.0.1:8000",
        "--noreload"
    )


def abrir_navegador():
    time.sleep(5)
    webbrowser.open("http://127.0.0.1:8000/")


if __name__ == "__main__":

    navegador = threading.Thread(
        target=abrir_navegador,
        daemon=True
    )

    navegador.start()

    iniciar_servidor()