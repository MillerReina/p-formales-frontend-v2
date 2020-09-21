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
  public root: {}

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


  // f(){
  //   this.producctions.forEach(res =>{
  //     this.getProductionsByNoter(res.simboloNoTer, [])
  //   })
  // }


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
    let level = 0
    this.root = {
      name: this.tree.simboloInicial,
      children: [],
      size: 10
    }
    this.getProductionsByNoter(this.root['name'], this.root['children'], level)
    /**children vacio */
  }

  // graphicTree(level, children) {
  //   this.producctions.forEach((res: Production) => {
  //     this.addChild(res.simboloTer, children)
  //     while (level < 3) {
  //       level++
  //       console.log(children, 'hijo');
  //       this.graphicTree(level, children[0]['children'])
  //     }
  //   })
  // }

  // addChild(simboloTer: string[], child: any[]) {
  //   simboloTer.forEach(res => {
  //     this.getProductionsByNoter(this.getTer(res), child)
  //   })
  // }

  // getTer(terminal: string) {
  //   let simboloNoTerminal = ''
  //   for (let index = 0; index < terminal.length; index++) {
  //     if (terminal.charCodeAt(index) >= 65 && terminal.charCodeAt(index) <= 90) {
  //       simboloNoTerminal = terminal.charAt(index)
  //     }
  //   }
  //   return simboloNoTerminal
  // }

  /**Obtener las p´roducciones por Simbolo No terminal */
  getProductionsByNoter(noTer: string, child: any[], level) {
    while (level < 3) {
      this.producctions.forEach((res: Production) => {
        if (res.simboloNoTer == noTer) {
          level++
          res.simboloTer.forEach(noter => {
            child.push({
              name: noter,
              children: [],
              size: 5
            })
            this.getProductionsByNoter(noter, child[0]['children'], level)
          })
        }else{ level++}
      })
    }
    this.dataSource.push(this.root)
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

    networkSeries.dataFields.value = 'size';
    networkSeries.dataFields.name = 'name';
    networkSeries.dataFields.children = 'children';
    networkSeries.nodes.template.tooltipText = '{name}:{size}';
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
