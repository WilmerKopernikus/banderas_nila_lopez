import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {
  valores = [
    'Precisión técnica en cada pieza',
    'Honestidad y transparencia con nuestros clientes',
    'Respeto por los símbolos patrios e institucionales',
    'Entrega responsable y cumplimiento documentado'
  ];
}