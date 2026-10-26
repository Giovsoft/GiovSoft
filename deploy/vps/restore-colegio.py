#!/usr/bin/env python3
"""Restore a private school backup into a NEW staging directory; no network."""
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tarfile


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest()


def restore(archive, checksum, destination):
    os.umask(0o077)
    if destination.exists() or destination.is_symlink():
        raise ValueError('El destino ya existe; no se sobrescribe.')
    if not destination.parent.is_dir():
        raise ValueError('Primero crea la carpeta padre privada del destino.')
    match = re.fullmatch(r'([0-9a-fA-F]{64}) [ *]' + re.escape(archive.name) + r'\n?', checksum.read_text())
    if not match or digest(archive) != match.group(1).lower():
        raise ValueError('Checksum incorrecto o archivo de checksum inesperado.')
    with tarfile.open(archive, 'r:gz') as tar:
        files = {}
        for member in tar.getmembers():
            path = PurePosixPath(member.name)
            if path.is_absolute() or '..' in path.parts or not path.parts or path.parts[0] != 'datos':
                raise ValueError('El archivo contiene una ruta inesperada.')
            if not member.isdir() and not member.isfile():
                raise ValueError('No se permiten enlaces ni archivos especiales.')
            if member.isdir():
                continue
            relative = path.relative_to('datos')
            if str(relative) in ('content.json', 'store-accounts.json'):
                target = PurePosixPath('data') / relative
            elif len(relative.parts) > 1 and relative.parts[0] == 'uploads':
                target = relative
            else:
                raise ValueError('Archivo fuera del inventario permitido.')
            if target in files:
                raise ValueError('Ruta de archivo duplicada.')
            files[target] = member
        for filename, expected in [('content.json', dict), ('store-accounts.json', list)]:
            member = files.get(PurePosixPath('data') / filename)
            if not member:
                raise ValueError('Falta un JSON obligatorio.')
            with tar.extractfile(member) as source:
                value = json.load(source)
            if not isinstance(value, expected):
                raise ValueError('Formato JSON inesperado.')
        if not any(path.parts[0] == 'uploads' for path in files):
            raise ValueError('El respaldo no contiene imágenes subidas.')
        # All validation precedes creation. Never use archive paths for extraction.
        destination.mkdir(mode=0o700)
        for relative, member in files.items():
            target = destination.joinpath(*relative.parts)
            target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
            with tar.extractfile(member) as source, target.open('xb') as output:
                shutil.copyfileobj(source, output)
        with (destination / 'SHA256SUMS').open('x') as manifest:
            for relative in sorted(files):
                manifest.write(digest(destination.joinpath(*relative.parts)) + '  ' + str(relative) + '\n')
        print('Restauración inicial preparada:', destination)
        print('JSON válidos; archivos restaurados:', len(files))
        print('Manifiesto SHA256SUMS creado. No se modificaron servicios ni DNS.')


if __name__ == '__main__':
    if len(sys.argv) != 4:
        sys.exit('Uso: restore-colegio.py ARCHIVO CHECKSUM DESTINO_NUEVO')
    try:
        restore(*(Path(value).absolute() for value in sys.argv[1:]))
    except (OSError, ValueError, tarfile.TarError):
        # Do not expose JSON values, account records or archive names in errors.
        sys.exit('Restauración detenida: comprueba checksum, estructura del respaldo y que el destino no exista. Si hubo un fallo de disco, conserva la carpeta parcial para revisión.')
