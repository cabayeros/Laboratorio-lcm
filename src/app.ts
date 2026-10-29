import { Component, Input, OnDestroy, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet, Routes } from '@angular/router';

@Component({
  selector: 'lcm-home',
  imports: [RouterLink],
  template: `
    <section class="carousel" aria-roledescription="carrusel" aria-label="Beneficios Cliente Consentido" (mouseenter)="paused.set(true)" (mouseleave)="paused.set(false)" (focusin)="paused.set(true)">
      <img class="slide desktop-slide" [src]="'assets/img/Fondo_' + slides[current()] + '.jpg'" [alt]="descriptions[current()]">
      <div class="mobile-slides" [class.orphan]="mobileStart() + 1 >= slides.length">
        <div class="mobile-slide">
          <img [src]="'assets/img/Fondo_' + slides[mobileStart()] + '.jpg'" [alt]="descriptions[mobileStart()]">
          @if (mobileStart() === 0) { <a class="slide-action button" routerLink="/mi-cuenta">Iniciar Sesión</a> }
          @if (mobileStart() === 1) { <a class="slide-action button" href="https://www.facebook.com/LaboratoriosCentroMedico/" target="_blank" rel="noopener noreferrer">Visítanos en Facebook</a> }
          @if (mobileStart() === 2) { <a class="slide-action button" href="https://www.facebook.com/LaboratoriosCentroMedico/photos" target="_blank" rel="noopener noreferrer">Nuestros Productos</a> }
        </div>
        @if (mobileStart() + 1 < slides.length) {
          <div class="mobile-slide">
            <img [src]="'assets/img/Fondo_' + slides[mobileStart() + 1] + '.jpg'" [alt]="descriptions[mobileStart() + 1]">
            @if (mobileStart() + 1 === 1) { <a class="slide-action button" href="https://www.facebook.com/LaboratoriosCentroMedico/" target="_blank" rel="noopener noreferrer">Visítanos en Facebook</a> }
            @if (mobileStart() + 1 === 2) { <a class="slide-action button" href="https://www.facebook.com/LaboratoriosCentroMedico/photos" target="_blank" rel="noopener noreferrer">Nuestros Productos</a> }
          </div>
        }
      </div>
      @if (current() === 0) { <a class="slide-action button" routerLink="/mi-cuenta">Iniciar Sesión</a> }
      @if (current() === 1) { <a class="slide-action button" href="https://www.facebook.com/LaboratoriosCentroMedico/" target="_blank" rel="noopener noreferrer">Visítanos en Facebook</a> }
      @if (current() === 2) { <a class="slide-action button" href="https://www.facebook.com/LaboratoriosCentroMedico/photos" target="_blank" rel="noopener noreferrer">Nuestros Productos</a> }
      <button class="arrow previous" aria-label="Diapositiva anterior" (click)="move(-1)">‹</button>
      <button class="arrow next" aria-label="Diapositiva siguiente" (click)="move(1)">›</button>
      <div class="indicators desktop-indicators">@for (slide of slides; track $index) { <button [class.selected]="current() === $index" [attr.aria-label]="'Ver diapositiva ' + ($index + 1)" [attr.aria-current]="current() === $index ? 'true' : null" (click)="current.set($index)"></button> }</div>
      <div class="indicators mobile-indicators">@for (start of mobileStarts; track start) { <button [class.selected]="isMobileStart(start)" [attr.aria-label]="'Ver grupo desde diapositiva ' + (start + 1)" [attr.aria-current]="isMobileStart(start) ? 'true' : null" (click)="current.set(start)"></button> }</div>
      <button class="pause" (click)="paused.set(!paused())">{{ paused() ? 'Reproducir' : 'Pausar' }}</button>
    </section>`
})
export class HomeComponent implements OnDestroy {
  readonly slides = [1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 11];
  readonly mobileStarts = this.slides.map((_, index) => index).filter(index => index % 2 === 0);
  readonly descriptions = ['Una tarjeta, muchos beneficios. Laboratorio y más. Solicita tu tarjeta al 9890-8884.', 'Laboratorios Centro Médico: visítanos en Facebook', 'Nuestros productos y servicios', 'Beneficios Cliente Consentido', 'Servicios de Laboratorios Centro Médico', 'Promociones Cliente Consentido', 'Salud y bienestar', 'Beneficios de tu tarjeta', 'Beneficios de tu tarjeta', 'Servicios y promociones LCM', 'Laboratorios Centro Médico'];
  readonly current = signal(0);
  readonly paused = signal(typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  private readonly timer = setInterval(() => { if (!this.paused()) this.move(1); }, 5000);
  mobileStart() { return Math.floor(this.current() / 2) * 2; }
  isMobileStart(start: number) { return this.mobileStart() === start; }
  move(direction: number) {
    if (typeof matchMedia !== 'undefined' && matchMedia('(max-width: 600px)').matches) {
      const page = Math.floor(this.current() / 2);
      this.current.set(((page + direction + this.mobileStarts.length) % this.mobileStarts.length) * 2);
      return;
    }
    this.current.update(value => (value + direction + this.slides.length) % this.slides.length);
  }
  ngOnDestroy() { clearInterval(this.timer); }
}

@Component({selector: 'lcm-about', template: `<section class="panel"><h1>Acerca de</h1><img class="information-image" src="assets/img/tarjetas.png" alt="Programa de beneficios Cliente Consentido de Laboratorios Centro Médico"></section>`})
export class AboutComponent {}

@Component({selector: 'lcm-rules', template: `<section class="panel"><h1>Reglamento</h1><div class="rules-body"><div><h2>REGLAMENTO PROGRAMA DE FIDELIDAD "CLIENTE CONSENTIDO"</h2><p>Disfruta de descuentos en Laboratorios Centro Médico y comercios afiliados al presentar tu tarjeta de beneficios ¨CLIENTE CONSENTIDO¨, además acumulas puntos por tus compras canjeables por Servicios de Laboratorio.</p><p>Para mayor información del Reglamento <a href="assets/reglamento.pdf" target="_blank" rel="noopener">Click Aquí <span class="sr-only">(PDF, abre en otra pestaña)</span></a></p></div></div></section>`})
export class RulesComponent {}

@Component({selector: 'lcm-partners', template: `<section class="panel"><h1>Aliados</h1><div class="panel-content"><h2>Información de aliados no disponible</h2><p>La sección del portal de origen presenta un error. El listado de comercios afiliados está pendiente de recuperación.</p><a href="https://www.facebook.com/LaboratoriosCentroMedico/" target="_blank" rel="noopener">Consultar con Laboratorios Centro Médico</a></div></section>`})
export class PartnersComponent {}

@Component({
  selector: 'lcm-account', imports: [FormsModule],
  template: `<section class="panel"><h1>{{catalog ? 'Catálogos' : 'Mi Cuenta'}}</h1><div class="account-body"><form #form="ngForm" (ngSubmit)="submit(form)" class="signin">
    <h2>Por favor Regístrate</h2>
    <label for="username">Nombre de Usuario</label><input id="username" name="username" [(ngModel)]="username" required maxlength="48" autocomplete="username">
    <label for="password">Contraseña</label><input id="password" name="password" type="password" [(ngModel)]="password" required maxlength="48" autocomplete="current-password">
    @if (form.submitted && form.invalid) { <p class="form-message" role="alert">Completa tu nombre de usuario y contraseña.</p> }
    <button class="button" type="submit" [disabled]="busy()">{{busy() ? 'Cargando…' : 'Enviar'}}</button>
    @if (message()) { <p class="form-message" role="status">{{message()}}</p> }
  </form></div></section>`
})
export class AccountComponent {
  @Input() catalog = false;
  username = '';
  password = '';
  busy = signal(false);
  message = signal('');
  async submit(form: NgForm) {
    if (form.invalid || this.busy()) return;
    this.busy.set(true); this.message.set('');
    try {
      const response = await fetch('api/session', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: this.username, password: this.password, purpose: this.catalog ? 'catalog' : 'account'})});
      const data: {message?: string} = await response.json();
      this.message.set(data.message ?? 'El servicio de cuentas no está disponible.');
    } catch { this.message.set('No fue posible conectar con el servicio de cuentas. Inténtalo más tarde.'); }
    finally { this.password = ''; this.busy.set(false); }
  }
}

@Component({selector:'lcm-catalog', imports:[AccountComponent], template:`<lcm-account [catalog]="true" />`})
export class CatalogComponent {}

@Component({
  selector: 'lcm-contact', imports: [FormsModule],
  template: `<section class="panel"><h1>Contáctenos</h1><div class="contact-body"><form #form="ngForm" (ngSubmit)="submit(form)">
    <label for="firstName">*Nombres</label><input id="firstName" name="firstName" [(ngModel)]="data.firstName" required maxlength="25" autocomplete="given-name">
    <label for="lastName">*Apellidos</label><input id="lastName" name="lastName" [(ngModel)]="data.lastName" required maxlength="25" autocomplete="family-name">
    <label for="phone">Teléfono</label><input id="phone" name="phone" [(ngModel)]="data.phone" pattern="[0-9]{8}" maxlength="8" type="tel" autocomplete="tel" title="8 dígitos, por ejemplo 22224444">
    <label for="email">*E-Mail</label><input id="email" name="email" [(ngModel)]="data.email" required email type="email" maxlength="50" autocomplete="email">
    <label for="card">*No. Tarjeta Cliente Consentido</label><input id="card" name="card" [(ngModel)]="data.card" required maxlength="16">
    <label for="message">*Mensaje</label><textarea id="message" name="message" [(ngModel)]="data.message" required maxlength="150" rows="5"></textarea>
    @if (form.submitted && form.invalid) { <p class="form-message" role="alert">Revisa los campos obligatorios, el correo y el teléfono de 8 dígitos.</p> }
    <button class="button" type="submit" [disabled]="busy()">{{busy() ? 'Enviando…' : 'Enviar'}}</button>
    @if (message()) { <p class="form-message" role="status">{{message()}}</p> }
  </form></div></section>`
})
export class ContactComponent {
  data = {firstName:'',lastName:'',phone:'',email:'',card:'',message:''};
  busy = signal(false); message = signal('');
  async submit(form: NgForm) {
    if (form.invalid || this.busy()) return;
    this.busy.set(true); this.message.set('');
    try {
      const response = await fetch('api/contact', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(this.data)});
      const result: {message?:string} = await response.json();
      this.message.set(result.message ?? 'El servicio de contacto no está disponible.');
      if (response.ok) form.resetForm();
    } catch { this.message.set('No fue posible conectar. Tu mensaje no fue enviado.'); }
    finally { this.busy.set(false); }
  }
}

export const routes: Routes = [
  {path:'',component:HomeComponent,title:'Inicio | Laboratorios Centro Médico'},
  {path:'acerca-de',component:AboutComponent,title:'Acerca de | LCM'},
  {path:'reglamento',component:RulesComponent,title:'Reglamento | LCM'},
  {path:'aliados',component:PartnersComponent,title:'Aliados | LCM'},
  {path:'catalogos',component:CatalogComponent,title:'Catálogos | LCM'},
  {path:'mi-cuenta',component:AccountComponent,title:'Mi Cuenta | LCM'},
  {path:'contactenos',component:ContactComponent,title:'Contáctenos | LCM'},
  {path:'**',redirectTo:''}
];

@Component({
  selector:'lcm-app', imports:[RouterOutlet,RouterLink,RouterLinkActive],
  template:`<a class="skip" href="#contenido">Saltar al contenido</a><div class="site"><div class="topline"><span>.:: Tarjeta Cliente Consentido ::. | <a routerLink="/mi-cuenta">Iniciar sesión</a></span></div>
  <header><a routerLink="/" aria-label="Laboratorios Centro Médico, inicio"><img class="logo" src="assets/img/logo.png" alt="Laboratorios Centro Médico"></a><nav id="navigation" aria-label="Navegación principal">@for (item of navigation; track item.path) {<a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" ariaCurrentWhenActive="page" [attr.aria-label]="item.label" [title]="item.label"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path [attr.d]="item.icon"></path></svg><span>{{item.label}}</span></a>}</nav></header>
  <main id="contenido" tabindex="-1"><router-outlet /></main><footer><p>© Laboratorios Centro Médico 2016</p><img src="assets/img/DATACODE.png" alt="DATACODE"></footer></div>`
})
export class AppComponent {
  navigation = [
    {path:'/',label:'Inicio',icon:'M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6'},
    {path:'/acerca-de',label:'Acerca de',icon:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0M3 3h3'},
    {path:'/reglamento',label:'Reglamento',icon:'M6 3h12v18l-6-3-6 3V3Zm3 5h6m-6 4h6'},
    {path:'/aliados',label:'Aliados',icon:'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7a4 4 0 0 1 0 8m2 3a4 4 0 0 1 4 4v2'},
    {path:'/catalogos',label:'Catálogos',icon:'M3 4h18v16H3zM3 9h18M9 9v11m6-11v11'},
    {path:'/mi-cuenta',label:'Mi Cuenta',icon:'M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'},
    {path:'/contactenos',label:'Contáctenos',icon:'M3 5h18v14H3zM3 6l9 7 9-7'}
  ];
}
