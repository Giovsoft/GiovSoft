#!/usr/bin/env bash
# Run personally in Cloud Shell, after VPS preflight. No Stripe/Commerce changes.
set -euo pipefail
umask 077
if [[ "${1:-}" != --freeze-and-copy ]]; then
  printf 'Uso en Cloud Shell: bash colegio-final-copy.sh --freeze-and-copy\n'
  printf 'Inicia mantenimiento del colegio GCP; conserva Commerce y API.\n'
  exit 2
fi
project=healthy-genre-497401-j7
service=colegio-iberoamericano
region=us-central1
command -v gcloud >/dev/null
command -v python3 >/dev/null
colegio_final_dir=$(mktemp -d "${COLEGIO_BACKUP_PARENT:-$HOME}/colegio-respaldo-final.XXXXXX")
printf 'Carpeta privada de corte: %s\n' "$colegio_final_dir"
gcloud run services describe "$service" --project "$project" --region "$region" \
  --format=json > "$colegio_final_dir/origen-antes.json"
python3 - "$colegio_final_dir" <<'PY'
import json, pathlib, shlex, sys
root = pathlib.Path(sys.argv[1])
state = json.loads((root / 'origen-antes.json').read_text())
annotations = state.get('metadata', {}).get('annotations', {})
mode = annotations.get('run.googleapis.com/scalingMode', 'automatic')
count = annotations.get('run.googleapis.com/manualInstanceCount', '')
if mode == 'manual' and str(count) == '0':
    sys.exit('El origen ya está pausado: revisar el corte anterior antes de repetir.')
timeout = int(state['spec']['template']['spec'].get('timeoutSeconds', 300))
if not 1 <= timeout <= 3600:
    sys.exit('Timeout de origen inesperado; revisar antes del mantenimiento.')
(root / 'drain-seconds').write_text(str(timeout + 30))
traffic = state.get('status', {}).get('traffic', [])
urls = [state['status']['url']] + [t['url'] for t in traffic if t.get('tag') and t.get('url')]
(root / 'urls-origen').write_text('\n'.join(dict.fromkeys(urls)) + '\n')
base = ['gcloud', 'run', 'services']
flags = ['--project=healthy-genre-497401-j7', '--region=us-central1']
scale = count if mode == 'manual' and count else 'auto'
lines = ['#!/usr/bin/env bash', 'set -euo pipefail',
    '# SOLO antes de escrituras en VPS. Después, reconciliar datos primero.',
    shlex.join(base + ['update', 'colegio-iberoamericano', '--scaling=' + str(scale)] + flags)]
tags = [t['tag'] + '=' + t['revisionName'] for t in traffic if t.get('tag') and t.get('revisionName')]
if tags:
    lines.append(shlex.join(base + ['update-traffic', 'colegio-iberoamericano', '--set-tags=' + ','.join(tags)] + flags))
(root / 'reactivar-origen-antes-de-escrituras-vps.sh').write_text('\n'.join(lines) + '\n')
print('Inventario y reactivación guardados; espera de drenaje:', timeout + 30, 'segundos.')
PY
trap 'printf "Corte interrumpido. El origen puede seguir pausado. Conserva %s y revisa la guía de reversión; no repitas a ciegas.\n" "$colegio_final_dir" >&2' ERR
gcloud run services update-traffic "$service" --project "$project" --region "$region" --clear-tags
gcloud run services update "$service" --project "$project" --region "$region" --scaling=0
gcloud run services describe "$service" --project "$project" --region "$region" \
  --format=json > "$colegio_final_dir/origen-pausado.json"
python3 - "$colegio_final_dir/origen-pausado.json" <<'PY'
import json, sys
s = json.load(open(sys.argv[1]))
a = s.get('metadata', {}).get('annotations', {})
if a.get('run.googleapis.com/scalingMode') != 'manual' or str(a.get('run.googleapis.com/manualInstanceCount')) != '0':
    sys.exit('No se confirmó manual/0; detener antes de copiar.')
if any(t.get('tag') for t in s.get('status', {}).get('traffic', [])):
    sys.exit('Aún hay etiquetas activas; detener antes de copiar.')
print('Origen manual/0 y sin etiquetas confirmado.')
PY
remaining=$(cat "$colegio_final_dir/drain-seconds")
while (( remaining > 0 )); do
  printf 'Esperando solicitudes previas; faltan %s segundos.\n' "$remaining"
  step=30
  if (( remaining < step )); then step=$remaining; fi
  sleep "$step"
  remaining=$((remaining-step))
done
while IFS= read -r colegio_origin_url; do
  code=$(curl --silent --show-error --max-time 20 --output /dev/null \
    --write-out '%{http_code}' "${colegio_origin_url}/api/health")
  if [[ "$code" != 503 && "$code" != 404 ]]; then
    printf 'Origen o etiqueta aún responde con HTTP %s; revisar antes de copiar.\n' "$code" >&2
    exit 1
  fi
done < "$colegio_final_dir/urls-origen"
mkdir "$colegio_final_dir/datos"
gcloud storage ls --recursive --long \
  gs://healthy-genre-497401-j7-iberoamericano/colegio-iberoamericano/ \
  > "$colegio_final_dir/inventario-antes.txt"
gcloud storage rsync --recursive \
  gs://healthy-genre-497401-j7-iberoamericano/colegio-iberoamericano/ \
  "$colegio_final_dir/datos"
gcloud storage ls --recursive --long \
  gs://healthy-genre-497401-j7-iberoamericano/colegio-iberoamericano/ \
  > "$colegio_final_dir/inventario-despues.txt"
cmp "$colegio_final_dir/inventario-antes.txt" "$colegio_final_dir/inventario-despues.txt"
python3 - "$colegio_final_dir/datos" <<'PY'
import json, pathlib, sys
r = pathlib.Path(sys.argv[1])
assert isinstance(json.loads((r / 'content.json').read_text()), dict)
assert isinstance(json.loads((r / 'store-accounts.json').read_text()), list)
assert (r / 'uploads').is_dir()
files = [p for p in r.rglob('*') if p.is_file()]
print('Copia final JSON válida; archivos:', len(files))
PY
tar -C "$colegio_final_dir" -czf "$colegio_final_dir/colegio-final.tar.gz" datos
(cd "$colegio_final_dir" && sha256sum colegio-final.tar.gz > colegio-final.tar.gz.sha256)
printf 'Copia final preparada: %s\n' "$colegio_final_dir"
printf 'Origen sigue en mantenimiento. No cambiar DNS hasta restaurar y verificar el VPS.\n'
