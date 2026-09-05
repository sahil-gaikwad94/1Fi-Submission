#!/usr/bin/env bash
set -euo pipefail
mkdir -p server/public/products
curl -L --fail --silent --show-error 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85' -o server/public/products/iphone15.jpg
curl -L --fail --silent --show-error 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85' -o server/public/products/iphone15pro.jpg
curl -L --fail --silent --show-error 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85' -o server/public/products/macbookair.jpg
curl -L --fail --silent --show-error 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85' -o server/public/products/samsungtv.jpg
curl -L --fail --silent --show-error 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=85' -o server/public/products/airpods.jpg
curl -L --fail --silent --show-error 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85' -o server/public/products/applewatch.jpg
curl -L --fail --silent --show-error 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85' -o server/public/products/ring.jpg
curl -L --fail --silent --show-error 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85' -o server/public/products/goa.jpg
printf 'Downloaded %s product photos\n' "$(find server/public/products -name '*.jpg' | wc -l)"
