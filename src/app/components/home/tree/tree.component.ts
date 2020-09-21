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
  public producctions: Production[] = []
  public babyProd = []

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId, private zone: NgZone) {
    this.tree = new Tree();
    this.state = false;
    this.chart = null;
  }


  getProductions() {
    this.producciones.forEach((element: string) => {
      let currentProduction = new Production()
      currentProduction.simboloNoTer = element.substr(0, 1)
      element.split('=').forEach(res => {
        if (res.includes('|')) {
          res.split('|').forEach(ter => {
            currentProduction.simboloTer.push(ter)
          })
        }
      })
      this.producctions.push(currentProduction)
    });
  }




  ngOnInit(): void {
    document.getElementById('father').style.display = 'none';
  }

  ngAfterViewInit() {
    /* this.getData(); */
    this.graphic();
  }



  agregarProduccion(produccion) {
    this.producciones.push(produccion.value);
  }


  addDatas() {
    let children = []
    let root = {
      name: this.tree.simboloInicial,
      children: children
    }
    this.producctions.forEach((res: Production) => {
      if (res.simboloNoTer === this.tree.simboloInicial) {
        console.log(res.simboloNoTer, this.tree.simboloInicial, 'simbolos');
        res.simboloTer.forEach(ter => {
          let babyChildren = []
          this.validateBabyChildren(babyChildren, ter)
          setTimeout(() => {
            children.push({
              name: ter,
              children: babyChildren
            })
          }, 600);
        })
      }
    })
    setTimeout(() => {
      this.dataSource.push(root)
      console.log(this.dataSource, 'hike');
    }, 700);

  }

  /**Validar si un nodo tiene hijos */
  validateBabyChildren(babyChildren: any[], noter: string) {
    for (let index = 0; index < noter.length; index++) {
      if (noter.charCodeAt(index) >= 65 && noter.charCodeAt(index) <= 90) {
        this.getProductionsByNoter(noter.charAt(index))
      }
    }
    setTimeout(() => {
      babyChildren = this.babyProd
      console.log(babyChildren, 'baby');
    }, 500);
  }

  /**Obtener las p´roducciones por Simbolo No terminal */
  getProductionsByNoter(noTer: string) {
    this.producctions.forEach((res: Production) => {
      if (res.simboloNoTer == noTer) {
        res.simboloTer.forEach(noter => {
          this.babyProd.push({
            name: noter,
            children: []
          })
        })
      }
    })
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
      this.producciones.push(form.value.produccion)
      console.log(this.tree);
      this.getProductions()
      this.addDatas()
      if (this.state) {
        document.getElementById('father').style.display = 'block';
        this.graphic();
        this.limpiarCampos();
      } else {
        document.getElementById('father').style.display = 'none';
      }
    }
    this.getProductions()
  }

  limpiarCampos() {
    this.tree.simboloTer = '';
    this.tree.simboloNoTer = '';
    this.tree.simboloInicial = '';
    this.tree.simboloProducciones = '';
  }

  volver() {
    this.state = false;
    if (this.state) {
      document.getElementById('father').style.display = 'block';
      this.graphic();
    } else {
      document.getElementById('father').style.display = 'none';
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

    /*chart.data = [
      {
        name: this.tree.simboloInicial,
        children: [
          {
            name: 'First',
            children: [
              { name: 'A1', value: 100 },
              { name: 'A2', value: 60 },
            ],
          },
          {
            name: 'Second',
            children: [
              { name: 'B1', value: 135 },
              { name: 'B2', value: 98 },
            ],
          },
          {
            name: 'Third',
            children: [
              {
                name: 'C1',
                children: [
                  { name: 'EE1', value: 130 },
                  { name: 'EE2', value: 87 },
                  { name: 'EE3', value: 55 },
                ],
              },
              { name: 'C2', value: 148 },
              {
                name: 'C3',
                children: [
                  { name: 'CC1', value: 53 },
                  { name: 'CC2', value: 30 },
                ],
              },
              { name: 'C4', value: 26 },
            ],
          },
          {
            name: 'Fourth',
            children: [
              { name: 'D1', value: 415 },
              { name: 'D2', value: 148 },
              { name: 'D3', value: 89 },
            ],
          },
          {
            name: 'Fifth',
            children: [
              {
                name: 'E1',
                children: [
                  { name: 'EE1', value: 33 },
                  { name: 'EE2', value: 40 },
                  { name: 'EE3', value: 89 },
                ],
              },
              {
                name: 'E2',
                value: 148,
              },
            ],
          },
        ],
      },
    ];*/
    setTimeout(() => {
      chart.data = this.dataSource
    }, 1000);

    networkSeries.dataFields.value = 'value';
    networkSeries.dataFields.name = 'name';
    networkSeries.dataFields.children = 'children';
    networkSeries.nodes.template.tooltipText = '{name}:{value}';
    networkSeries.nodes.template.fillOpacity = 1;

    networkSeries.nodes.template.label.text = '{name}';
    networkSeries.fontSize = 10;

    networkSeries.links.template.strokeWidth = 1;

    let hoverState = networkSeries.links.template.states.create('hover');
    hoverState.properties.strokeWidth = 3;
    hoverState.properties.strokeOpacity = 1;

    let title = chart.titles.create();
    title.text = 'Árbol de derivación';

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
