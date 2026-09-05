import fs from 'node:fs';
const file = 'server/data/seed.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const map = { prod_iphone15:'iphone15', prod_iphone15pro:'iphone15pro', prod_macbookair:'macbookair', prod_samsungtv:'samsungtv', prod_airpods:'airpods', prod_watch:'applewatch', prod_caratlane_ring:'ring', prod_cgh_earth:'goa' };
for (const product of data.products) product.image = `/static/products/${map[product.id]}.jpg`;
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
