import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  ofertas = [
    {
      title: 'Diseño y desarrollo de artes',
      text: 'Adaptación de escudos, pantones y proporciones a la normativa oficial de banderas.',
    },
    {
      title: 'Confección artesanal y digital',
      text: 'Bordado manual, sublimación de alta definición y confección con refuerzos industriales.',
    },
    {
      title: 'Kits institucionales completos',
      text: 'Asta, moño, funda de transporte, base y etiqueta de inventario para control interno.',
    },
    {
      title: 'Restauración y mantenimiento',
      text: 'Reparación de costuras, renovación de herrajes y limpieza especializada.',
    },
  ];
}