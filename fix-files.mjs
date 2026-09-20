import fs from 'fs';

// 1. Fix foods
let foods = fs.readFileSync('app/app/foods/page.tsx', 'utf-8');
foods = foods.replace('const [motor, setMotor] = useState<"google" | "overpass">("google");', '');
foods = foods.replace('body: JSON.stringify({ nicho, cidade, motor }),', 'body: JSON.stringify({ nicho, cidade }),');
foods = foods.replace(/<div className="w-full mt-2 flex items-center justify-between">[\s\S]*?Trazer fotos reais do Google Maps na busca \(mais demorado\)[\s\S]*?<\/label>\s*<\/div>/, '');
foods = foods.replace(/let fotoUrl = emp\.foto;\s*if \(!fotoUrl && \(emp\.website \|\| emp\.instagram\)\) \{\s*const u = emp\.website \|\| emp\.instagram;\s*fotoUrl = `https:\/\/t0\.gstatic\.com\/faviconV2\?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=\$\{u\}&size=128`;\s*\}/, 'let fotoUrl = emp.foto;\n                if (!fotoUrl) { fotoUrl = `/api/foto-maps?q=${encodeURIComponent(emp.nome + " " + emp.cidade)}`; }');
fs.writeFileSync('app/app/foods/page.tsx', foods);

// 2. Fix insta
let insta = fs.readFileSync('app/app/insta/page.tsx', 'utf-8');
insta = insta.replace('const [motor, setMotor] = useState<"google" | "overpass">("google");', '');
insta = insta.replace('body: JSON.stringify({ hashtag, cidade, motor }),', 'body: JSON.stringify({ hashtag, cidade }),');
insta = insta.replace(/<div className="w-full mt-2 flex items-center justify-between">[\s\S]*?Trazer fotos reais do Google Maps na busca \(mais demorado\)[\s\S]*?<\/label>\s*<\/div>/, '');
insta = insta.replace(/let fotoUrl = p\.foto;\s*if \(!fotoUrl && \(p\.website \|\| p\.instagram\)\) \{\s*const u = p\.website \|\| p\.instagram;\s*fotoUrl = `https:\/\/t0\.gstatic\.com\/faviconV2\?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=\$\{u\}&size=128`;\s*\}/, 'let fotoUrl = p.foto;\n                if (!fotoUrl) { fotoUrl = `/api/foto-maps?q=${encodeURIComponent(p.nome + " " + p.cidade)}`; }');
fs.writeFileSync('app/app/insta/page.tsx', insta);

// 3. Fix page.tsx
let page = fs.readFileSync('app/app/page.tsx', 'utf-8');
page = page.replace(/if \(!fotoUrl && \(l\.website \|\| l\.instagram\)\) \{\s*const u = l\.website \|\| l\.instagram;\s*fotoUrl = `https:\/\/t0\.gstatic\.com\/faviconV2\?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=\$\{u\}&size=128`;\s*\}/, 'if (!fotoUrl) { fotoUrl = `/api/foto-maps?q=${encodeURIComponent(l.nome + " " + l.cidade)}`; }');
fs.writeFileSync('app/app/page.tsx', page);

