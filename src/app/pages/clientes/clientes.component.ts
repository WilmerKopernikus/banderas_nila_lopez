import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  testimonios = [
    {
      entidad: 'Embajada en Bogotá',
      texto: 'Recibimos un acompañamiento riguroso en medidas y protocolo. La entrega fue puntual y con documentación completa.',
      responsable: 'Oficial de protocolo',
    },
    {
      entidad: 'Universidad pública',
      texto: 'Las banderas para auditorios y aulas mantienen su color y textura incluso con uso frecuente.',
      responsable: 'Coordinador logístico',
    },
    {
      entidad: 'Entidad gubernamental',
      texto: 'Excelente respuesta para eventos de alto nivel y visitas internacionales.',
      responsable: 'Dirección de ceremonial',
    },
  ];
}