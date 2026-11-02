import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../dist/lcm/browser/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.gif':'image/gif','.ico':'image/x-icon','.pdf':'application/pdf','.ttf':'font/ttf','.otf':'font/otf'};
function json(res, status, message) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify({message}));
}
export function validContact(data) {
  const limits = {firstName:25,lastName:25,email:50,card:16,message:150};
  return Object.entries(limits).every(([key,max]) => typeof data?.[key] === 'string' && data[key].trim().length > 0 && data[key].length <= max)
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    && (data.phone === undefined || data.phone === '' || (typeof data.phone === 'string' && /^[0-9]{8}$/.test(data.phone)));
}
export function createApp() {
  return createServer(async (req,res) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
    catch { return json(res,400,'Ruta inválida.'); }
    if (pathname.startsWith('/api/')) {
      if (pathname === '/api/health' && req.method === 'GET') return json(res,200,'Servicio Node disponible.');
      if (!['/api/contact','/api/session'].includes(pathname)) return json(res,404,'Servicio no encontrado.');
      if (req.method !== 'POST') { res.setHeader('Allow','POST'); return json(res,405,'Método no permitido.'); }
      if (!req.headers['content-type']?.startsWith('application/json')) return json(res,415,'Se requiere JSON.');
      let body = ''; let size = 0;
      try {
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 8192) { json(res,413,'Solicitud demasiado grande.'); return; }
          body += chunk.toString();
        }
        const data = JSON.parse(body);
        if (pathname === '/api/contact') {
          if (!validContact(data)) return json(res,400,'Revisa los campos del formulario.');
          // Integrar aquí un proveedor de correo o un servicio de negocio Node.
          return json(res,503,'El servicio de contacto está pendiente de configuración. Tu mensaje no fue enviado.');
        }
        if (!data || typeof data.username !== 'string' || typeof data.password !== 'string' || !data.username.trim() || !data.password || data.username.length > 48 || data.password.length > 48 || !['account','catalog'].includes(data.purpose)) return json(res,400,'Revisa tu nombre de usuario y contraseña.');
        // No se simula autenticación ni se almacenan credenciales del usuario.
        return json(res,503,'El servicio de cuentas está pendiente de integración. No fue posible iniciar sesión.');
      } catch { return json(res,400,'Solicitud JSON inválida.'); }
    }
    if (!['GET','HEAD'].includes(req.method)) return json(res,405,'Método no permitido.');
    const target = resolve(root, '.' + pathname);
    if (target !== resolve(root) && !target.startsWith(root.endsWith(sep) ? root : root + sep)) return json(res,403,'Ruta no permitida.');
    try {
      let file = target;
      try { if (!(await stat(file)).isFile()) file = resolve(root,'index.html'); }
      catch {
        if (extname(pathname)) return json(res,404,'Archivo no encontrado.');
        file = resolve(root,'index.html');
      }
      const data = await readFile(file);
      res.writeHead(200,{'Content-Type':types[extname(file)] ?? 'application/octet-stream','Cache-Control':'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch { json(res,503,'Compila la aplicación con npm run build antes de iniciar el servidor.'); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port,process.env.HOST ?? '127.0.0.1',() => console.log(`LCM: http://127.0.0.1:${port}`));
}
