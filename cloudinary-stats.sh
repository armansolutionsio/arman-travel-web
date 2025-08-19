#!/bin/bash

# Script para obtener estadísticas de Cloudinary
# Usar: ./cloudinary-stats.sh

CLOUD_NAME="ddu5kh0ov"
API_KEY="425247837769118"
API_SECRET="Jgk6GVmke0i0O4IWRBBQVAN-Zl4"

echo "ESTADISTICAS DE CLOUDINARY - ARMAN TRAVEL"
echo "=========================================="

echo ""
echo "INFORMACION DE USO:"
curl -s -u "$API_KEY:$API_SECRET" \
  "https://api.cloudinary.com/v1_1/$CLOUD_NAME/usage" | \
  python -c "
import sys, json
try:
    data = json.load(sys.stdin)
    storage_mb = data.get('storage', {}).get('usage', 0) / (1024*1024)
    storage_limit_mb = data.get('storage', {}).get('limit', 0) / (1024*1024)
    transformations = data.get('transformations', {}).get('usage', 0)
    transformations_limit = data.get('transformations', {}).get('limit', 0)
    bandwidth_mb = data.get('bandwidth', {}).get('usage', 0) / (1024*1024)
    total_resources = data.get('resources', 0)
    
    if storage_limit_mb > 0:
        storage_percent = storage_mb/storage_limit_mb*100
    else:
        storage_percent = 0
        
    if transformations_limit > 0:
        transform_percent = transformations/transformations_limit*100
    else:
        transform_percent = 0
    
    print(f'Storage: {storage_mb:.1f} MB / {storage_limit_mb:.0f} MB ({storage_percent:.1f}%)')
    print(f'Transformaciones: {transformations:,} / {transformations_limit:,} ({transform_percent:.1f}%)')
    print(f'Bandwidth: {bandwidth_mb:.1f} MB')
    print(f'Total recursos: {total_resources:,}')
except Exception as e:
    print(f'Error obteniendo estadisticas de uso: {e}')
"

echo ""
echo "IMAGENES DE ARMAN TRAVEL:"
curl -s -u "$API_KEY:$API_SECRET" \
  "https://api.cloudinary.com/v1_1/$CLOUD_NAME/resources/image/upload?prefix=arman-travel&max_results=500" | \
  python -c "
import sys, json
try:
    data = json.load(sys.stdin)
    resources = data.get('resources', [])
    
    gallery_count = len([r for r in resources if 'gallery' in r.get('public_id', '')])
    covers_count = len([r for r in resources if 'covers' in r.get('public_id', '')])
    other_count = len(resources) - gallery_count - covers_count
    
    total_size_mb = sum(r.get('bytes', 0) for r in resources) / (1024*1024)
    
    print(f'Total imagenes ARMAN TRAVEL: {len(resources)}')
    print(f'Galeria: {gallery_count}')
    print(f'Portadas: {covers_count}')
    print(f'Otros: {other_count}')
    print(f'Tamano total: {total_size_mb:.1f} MB')
    
    if resources:
        print('')
        print('ULTIMAS 5 IMAGENES:')
        for i, resource in enumerate(resources[-5:]):
            name = resource.get('public_id', '').split('/')[-1]
            size_kb = resource.get('bytes', 0) / 1024
            created = resource.get('created_at', '')[:10]
            print(f'   {i+1}. {name} ({size_kb:.0f}KB) - {created}')
except Exception as e:
    print(f'Error obteniendo imagenes: {e}')
"

echo ""
echo "Consulta completada"