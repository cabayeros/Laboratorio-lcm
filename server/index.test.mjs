import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp,validContact} from './index.mjs';

test('valida contacto sin aceptar campos ausentes o demasiado largos',() => {
  const data = {firstName:'Ana',lastName:'López',email:'ana@example.com',card:'1234',message:'Consulta',phone:'22224444'};
  assert.equal(validContact(data),true);
  for (const patch of [{email:'inválido'},{message:''},{firstName:'a'.repeat(26)},{phone:'123'},{card:null}]) assert.equal(validContact({...data,...patch}),false);
});
test('API no simula inicio de sesión ni envío de correo',async () => {
  const server = createApp();
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const session = await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'usuario',password:'secreto',purpose:'account'})});
    assert.equal(session.status,503);
    const invalid = await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
    assert.equal(invalid.status,400);
    const contact = await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({firstName:'Ana',lastName:'López',email:'ana@example.com',card:'123',message:'Consulta'})});
    assert.equal(contact.status,503);
    assert.match((await contact.json()).message,/no fue enviado/);
    assert.equal((await fetch(base+'/api/session')).status,405);
    assert.equal((await fetch(base+'/api/unknown')).status,404);
    assert.equal((await fetch(base+'/assets/missing.jpg')).status,404);
    assert.equal((await fetch(base+'/..%2f..%2fcookies.txt')).status,403);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
