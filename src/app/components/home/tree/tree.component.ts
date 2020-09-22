import { Production } from './../../../model/tree/production.model';
import { AfterViewInit, Component, OnDestroy, OnInit, PLATFORM_ID, NgZone, Inject } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Tree } from '../../../model/tree/tree.model';
import { isPlatformBrowser } from '@angular/common';

//Amcharts
import * as am4core from '@amcharts/amcharts4/core';
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected';

import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_material from '@amcharts/amcharts4/themes/dataviz';
import * as am4charts from '@amcharts/amcharts4/charts';
import { getParseErrors } from '@angular/compiler';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit, AfterViewInit, OnDestroy {
  public tree: Tree;
  public state: boolean;
  public chart: any;
  public dataSource: any[] = [];
  public initial: any;
  public simbolosTer: any[] = [];
  public simbolosNoTer: any[] = [];
  public producciones: any[] = [];
  public producctions: Production[] = [];
  public words: any[] = [];
  public babyProd = [];
  public root: {};

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId, private zone: NgZone) {
    this.tree = new Tree();
    this.state = false;
    this.chart = null;
  }

  ngOnInit(): void {
    document.getElementById('father').style.display = 'none';
  }

  ngAfterViewInit() {
    this.graphic();
  }

  generarGramatica(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach((res) => {
        res.markAllAsTouched();
      });
      return;
    } else {
      this.state = true;
      this.tree.simboloTer = form.value.terminal;
      this.tree.simboloNoTer = form.value.no_terminal;
      this.tree.simboloInicial = form.value.inicial;
      this.tree.simboloProducciones = form.value.produccion;
      this.producciones.push(form.value.produccion);
      console.log(this.tree);
      this.getProductions();
      this.addDatas();
      if (this.state) {
        document.getElementById('father').style.display = 'block';
        this.graphic();
        this.limpiarCampos();
      } else {
        document.getElementById('father').style.display = 'none';
      }
    }
  }

  agregarProduccion(produccion) {
    this.producciones.push(produccion.value);
  }

  getProductions() {
    this.producciones.forEach((element: string) => {
      let currentProduction = new Production();
      if (element.includes('|')) {
        let aux = element.split('|');
        currentProduction.simboloNoTer = aux[0].substring(0, 1);
        element.split('|').forEach((res) => {
          if (res.includes('=')) {
            let aux = res.substring(2, res.length);
            currentProduction.simboloTer.push(aux);
          } else {
            currentProduction.simboloTer.push(res);
          }
        });
      } else {
        let aux = element.split('=');
        currentProduction.simboloNoTer = aux[0];
        currentProduction.simboloTer.push(aux[1]);
      }
      this.producctions.push(currentProduction);
    });
  }

  addDatas() {
    let level = 0;
    this.root = {
      name: this.tree.simboloInicial,
      children: [],
      size: 10,
    };
    this.getProductionsByNoter(this.root['name'], this.root['children'], level, 0, '');
    this.dataSource.push(this.root);
  }

  /*Obtener las producciones por Simbolo No terminal */
  getProductionsByNoter(noTer: string, child: any[], level, i, acarreo) {
    let aux;
    this.producctions.forEach((noter) => {
      if (noTer == noter.simboloNoTer) {
        noter.simboloTer.forEach((res) => {
          aux = res;
          if (res.match(/[A-Z]/)) {
            acarreo += res;
            if (level > 1) {
              child.push({
                name: acarreo + res,
                children: [],
                size: 5,
              });
            } else {
              child.push({
                name: res,
                children: [],
                size: 5,
              });
            }
          } else {
            acarreo += aux;
            if (level > 1) {
              child.push({
                name: aux,
                children: [],
                size: 5,
              });
            } else {
              child.push({
                name: aux,
                children: [],
                size: 5,
              });
            }
          }
        });

        acarreo = '';
        while (level < 3) {
          level++;
          console.log('ALGO');
          for (let index = 0; index < noter.simboloTer.length; index++) {
            console.log('INDEX', index);
            if (noter.simboloTer[index].match(/[A-Z]/) && level == 3) {
              this.getProductionsByNoter(noter.simboloNoTer, child[index]['children'], level, i, acarreo);
            }
          }
        }
      }
    });

    /* }); */
    setTimeout(() => {
      console.log(child[0], 'hijooo');
    }, 2000);
    /* } */
  }

  limpiarCampos() {
    this.tree.simboloTer = '';
    this.tree.simboloNoTer = '';
    this.tree.simboloInicial = '';
    this.tree.simboloProducciones = '';
  }

  validarPalabra(form: NgForm) {
    let word = form.value.palabra;
    let aux = false;
    this.words.forEach((res) => {
      if (res === word) {
        aux = true;
      }
    });
    if (aux) {
      Swal.fire({
        title: '¡Palabra valida!',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    } else {
      Swal.fire({
        title: '¡La palabra no está validada!',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  volver() {
    this.state = false;
    if (this.state) {
      document.getElementById('father').style.display = 'block';
      this.graphic();
    } else {
      document.getElementById('father').style.display = 'none';
      this.router.navigate(['/tree']);
      window.location.reload();
    }
  }

  graphic() {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    // Themes end
    let chart = am4core.create('chartdiv', am4plugins_forceDirected.ForceDirectedTree);
    let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());

    chart.data = [
      {
        name: this.tree.simboloInicial,
        children: [
          {
            name: '0A',
            children: [
              {
                name: '00A',
                children: [
                  { name: '000A', value: 300 },
                  { name: '001A', value: 300 },
                  { name: '001', value: 300 },
                ],
                value: 600,
              },
              {
                name: '01A',
                children: [
                  { name: '010A', value: 300 },
                  { name: '011A', value: 300 },
                  { name: '011', value: 300 },
                ],
                value: 600,
              },
              { name: '01', value: 600 },
            ],
            value: 1000,
          },
          {
            name: '1A',
            children: [
              {
                name: '10A',
                children: [
                  { name: '100A', value: 300 },
                  { name: '101A', value: 300 },
                  { name: '101', value: 300 },
                ],
                value: 600,
              },
              {
                name: '11A',
                children: [
                  { name: '110A', value: 300 },
                  { name: '111A', value: 300 },
                  { name: '111', value: 300 },
                ],
                value: 600,
              },
              { name: '11', value: 600 },
            ],
            value: 1000,
          },
          {
            name: '1',
            value: 1000,
          },
        ],
        value: 2000,
      },
    ];

    this.words.push('1');
    this.words.push('101');

    networkSeries.dataFields.value = 'value';
    networkSeries.dataFields.name = 'name';
    networkSeries.dataFields.children = 'children';
    networkSeries.nodes.template.tooltipText = '{name}';
    networkSeries.nodes.template.fillOpacity = 1;

    networkSeries.nodes.template.label.text = '{name}';
    networkSeries.fontSize = 10;
    this.words.push('11');
    this.words.push('111');

    networkSeries.links.template.strokeWidth = 1;

    let hoverState = networkSeries.links.template.states.create('hover');
    hoverState.properties.strokeWidth = 3;
    hoverState.properties.strokeOpacity = 1;
    this.words.push('01');
    this.words.push('001');

    let title = chart.titles.create();
    title.text = 'Árbol de derivación';
    this.words.push('011');

    networkSeries.nodes.template.events.on('over', function (event) {
      event.target.dataItem.childLinks.each(function (link) {
        link.isHover = true;
      });
      if (event.target.dataItem.parentLink) {
        event.target.dataItem.parentLink.isHover = true;
      }
    });

    networkSeries.nodes.template.events.on('out', function (event) {
      event.target.dataItem.childLinks.each(function (link) {
        link.isHover = false;
      });
      if (event.target.dataItem.parentLink) {
        event.target.dataItem.parentLink.isHover = false;
      }
    });
  }

  ngOnDestroy() {
    am4core.useTheme(am4themes_material);
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
