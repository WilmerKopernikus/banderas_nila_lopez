import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  preguntas = [
    {
      pregunta: '¿Hacen envíos a todo el país?',
      respuesta: 'Sí. Trabajamos con operadores logísticos nacionales con embalaje reforzado y seguimiento.'
    },
    {
      pregunta: '¿Pueden producir banderas personalizadas?',
      respuesta: 'Creamos artes, fichas técnicas y prototipos para banderas corporativas o institucionales únicas.'
    },
    {
      pregunta: '¿Qué materiales utilizan?',
      respuesta: 'Satín, dril, telas ignífugas y opciones para interior o exterior, según el uso requerido.'
    },
    {
      pregunta: '¿Cuáles son los tiempos de entrega?',
      respuesta: 'Entre 5 y 10 días hábiles según complejidad y cantidades. En casos urgentes coordinamos producción prioritaria.'
    },
  ];
}