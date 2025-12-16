import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Producto {
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: string;
  acabado: string;
}

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {
  productos: Producto[] = [
    {
      nombre: 'Bandera de Colombia',
      categoria: 'Banderas del mundo',
      descripcion: 'Satín europeo, doble costura y cinta de refuerzo para mástil.',
      precio: 'Desde $180.000',
      acabado: 'Interior y exterior',
    },
    {
      nombre: 'Bandera de la Unión Europea',
      categoria: 'Banderas del mundo',
      descripcion: 'Colores homologados, proporción 2:3 y argollas metálicas.',
      precio: 'Desde $210.000',
      acabado: 'Ceremonial',
    },
    {
      nombre: 'Bandera personalizada corporativa',
      categoria: 'Institucional',
      descripcion: 'Impresión de alta definición, herrajes y empaque de presentación.',
      precio: 'Cotización según diseño',
      acabado: 'Premium',
    },
    {
      nombre: 'Bandera para aula y auditorios',
      categoria: 'Educativo',
      descripcion: 'Dril nacional, vivos bordados y bases con terminación metálica.',
      precio: 'Desde $150.000',
      acabado: 'Interior',
    },
    {
      nombre: 'Estándarte ceremonial bordado',
      categoria: 'Ceremonial',
      descripcion: 'Bordado artesanal, flecos dorados y asta telescópica.',
      precio: 'Cotización personalizada',
      acabado: 'Colección protocolaria',
    },
  ];
}