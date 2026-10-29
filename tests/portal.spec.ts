import {test,expect} from '@playwright/test';

test('navegación, recursos originales y formularios sin PHP',async ({page}) => {
  const failures:string[] = [];
  page.on('pageerror',error => failures.push(error.message));
  page.on('console',message => { if (message.type() === 'error' && /Content Security Policy|Refused to/.test(message.text())) failures.push(message.text()); });
  page.on('response',response => { if (response.status() >= 400 && !response.url().includes('/api/')) failures.push(`${response.status()} ${response.url()}`); });
  await page.goto('/');
  await expect(page.getByRole('img',{name:/Una tarjeta/})).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCSS('display','flex');
  await page.getByRole('button',{name:'Pausar',exact:true}).click();
  await expect(page.locator('.desktop-indicators button')).toHaveCount(11);
  await page.getByRole('button',{name:'Diapositiva siguiente'}).click();
  await expect(page.getByRole('link',{name:'Visítanos en Facebook'})).toBeVisible();
  await page.screenshot({path:'test-results/preview-desktop.png',fullPage:true});
  for (const [label,path] of [['Acerca de','acerca-de'],['Reglamento','reglamento'],['Aliados','aliados'],['Catálogos','catalogos'],['Mi Cuenta','mi-cuenta'],['Contáctenos','contactenos']]) {
    await page.getByRole('navigation').getByRole('link',{name:label,exact:true}).click();
    await expect(page).toHaveURL(new RegExp('/'+path+'$'));
    await expect(page.getByRole('heading',{name:label,exact:true})).toBeVisible();
  }
  await page.getByRole('button',{name:'Enviar',exact:true}).click();
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.getByLabel('*Nombres',{exact:true}).fill('Ana');
  await page.getByLabel('*Apellidos',{exact:true}).fill('López');
  await page.getByLabel('*E-Mail',{exact:true}).fill('ana@example.com');
  await page.getByLabel('*No. Tarjeta Cliente Consentido',{exact:true}).fill('1234');
  await page.getByLabel('*Mensaje',{exact:true}).fill('Consulta de prueba local');
  await page.getByRole('button',{name:'Enviar',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Tu mensaje no fue enviado');
  await page.goto('/catalogos');
  await page.getByLabel('Nombre de Usuario',{exact:true}).fill('prueba-local');
  await page.getByLabel('Contraseña',{exact:true}).fill('prueba-local');
  const request = page.waitForRequest('**/api/session');
  await page.getByRole('button',{name:'Enviar',exact:true}).click();
  expect((await request).postDataJSON().purpose).toBe('catalog');
  await expect(page.getByRole('status')).toContainText('pendiente de integración');
  await expect(page.getByLabel('Contraseña',{exact:true})).toHaveValue('');
  expect(failures).toEqual([]);
});

test('menú móvil y rutas directas',async ({page,request}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await expect(page.locator('.menu-toggle')).toHaveCount(0);
  await expect(page.locator('#navigation')).toHaveCSS('display','flex');
  await expect(page.locator('#navigation a')).toHaveCount(7);
  await expect(page.locator('#navigation svg')).toHaveCount(7);
  for (const width of [320,390,600,601,768,1024]) {
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),`horizontal overflow at ${width}px`).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Pausar',exact:true}).click();
  await expect(page.locator('.mobile-slide')).toHaveCount(2);
  await expect(page.locator('.mobile-indicators button')).toHaveCount(6);
  await page.getByRole('button',{name:'Ver grupo desde diapositiva 11'}).click();
  await expect(page.locator('.mobile-slide')).toHaveCount(1);
  const orphan = await page.locator('.mobile-slide').boundingBox();
  const slides = await page.locator('.mobile-slides').boundingBox();
  if (!orphan || !slides) throw new Error('No se pudo medir la diapositiva impar en móvil.');
  expect(Math.abs(orphan.x + orphan.width / 2 - (slides.x + slides.width / 2))).toBeLessThan(1);
  await page.getByRole('button',{name:'Diapositiva siguiente'}).click();
  await expect(page.locator('.mobile-slide')).toHaveCount(2);
  await page.getByRole('navigation').getByRole('link',{name:'Reglamento',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Reglamento',exact:true})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/preview-mobile.png',fullPage:true});
  await page.reload();
  await expect(page.getByRole('heading',{name:'Reglamento',exact:true})).toBeVisible();
  const pdf = await request.get('/assets/reglamento.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toBe('application/pdf');
  expect((await request.get('/cookies.txt')).status()).toBe(404);
});
