import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DonutChartData {
  acertosExatos: number;
  acertosTendencia: number;
  erros: number;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent {
  data = input.required<DonutChartData>();

  // Calcula o total
  total = computed(() => {
    const d = this.data();
    return d.acertosExatos + d.acertosTendencia + d.erros;
  });

  // Calcula os percentuais
  acertosExatosPercent = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    return Math.round((this.data().acertosExatos / total) * 100);
  });

  acertosTendenciaPercent = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    return Math.round((this.data().acertosTendencia / total) * 100);
  });

  errosPercent = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    return Math.round((this.data().erros / total) * 100);
  });

  // Calcula o percentual total de acerto (exatos + tendência)
  totalAcertosPercent = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    return Math.round(((this.data().acertosExatos + this.data().acertosTendencia) / total) * 100);
  });

  // Calcula os ângulos para o SVG
  acertosExatosAngle = computed(() => {
    return (this.acertosExatosPercent() / 100) * 360;
  });

  acertosTendenciaAngle = computed(() => {
    return (this.acertosTendenciaPercent() / 100) * 360;
  });

  // Calcula os valores para stroke-dasharray e stroke-dashoffset
  circumference = computed(() => 2 * Math.PI);

  acertosExatosDashArray = computed(() => {
    const percent = this.acertosExatosPercent() / 100;
    return `${percent * this.circumference()} ${this.circumference()}`;
  });

  acertosTendenciaDashArray = computed(() => {
    const percent = this.acertosTendenciaPercent() / 100;
    return `${percent * this.circumference()} ${this.circumference()}`;
  });

  errosDashArray = computed(() => {
    const percent = this.errosPercent() / 100;
    return `${percent * this.circumference()} ${this.circumference()}`;
  });

  acertosTendenciaDashOffset = computed(() => {
    const percent = this.acertosExatosPercent() / 100;
    return -(percent * this.circumference());
  });

  errosDashOffset = computed(() => {
    const percent = (this.acertosExatosPercent() + this.acertosTendenciaPercent()) / 100;
    return -(percent * this.circumference());
  });

  // Calcula as coordenadas para o SVG
  getCoordinatesForPercent(percent: number): string {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return `${x},${y}`;
  }

  // Cria o path SVG para um segmento
  createPath(startPercent: number, endPercent: number, color: string): string {
    const startX = Math.cos(2 * Math.PI * startPercent);
    const startY = Math.sin(2 * Math.PI * startPercent);
    const endX = Math.cos(2 * Math.PI * endPercent);
    const endY = Math.sin(2 * Math.PI * endPercent);
    
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
    
    return `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
  }
}
