import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  destacados = [
    {
      title: 'Banderas del mundo',
      detail: 'Colecciones oficiales con proporciones exactas y acabados premium.',
    },
    {
      title: 'Institucional y ceremonial',
      detail: 'Estándares para embajadas, entidades gubernamentales y organismos multilaterales.',
    },
    {
      title: 'Diseños a medida',
      detail: 'Confección especial con herrajes, bordados y empaques personalizados.',
    },
  ];

  servicios = [
    {
      title: 'Asesoría protocolaria',
      description: 'Acompañamiento en normas de precedencia, medidas oficiales y etiqueta ceremonial.',
    },
    {
      title: 'Producción ágil',
      description: 'Taller propio en Bogotá con control de calidad y despachos a todo el país.',
    },
    {
      title: 'Materiales especializados',
      description: 'Satín europeo, dril nacional, telas ignífugas y opciones para interior o intemperie.',
    },
  ];

  clientes = ['Embajadas y consulados', 'Ministerios y gobernaciones', 'Fuerzas Militares', 'Universidades y colegios', 'Entidades multilaterales', 'Empresas privadas'];

  pasos = [
    {
      title: 'Diagnóstico y requisitos',
      text: 'Entendemos el protocolo institucional, cantidades y tipo de uso.'
    },
    {
      title: 'Muestra y aprobación',
      text: 'Presentamos fichas técnicas con telas, herrajes y confección sugerida.'
    },
    {
      title: 'Producción y entrega',
      text: 'Control de calidad y embalaje seguro con envíos a cualquier ciudad de Colombia.'
    }
  ];
}