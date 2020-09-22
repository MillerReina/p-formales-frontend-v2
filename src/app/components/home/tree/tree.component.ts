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
  /**Definimos las variables globales que vamos a utilizar en la implementación del módulo de árboles y gramáticas
   * para el caso particulaar, las producciones, los simbolos terminales y no terminales, el árbol y la lista de
   * palabras que son validadas por la gramática, basadas en el arbol de derivación 
   */
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

  /**
   * Este método se ejecuta con el evento del clic de generar gramática, agregamos el array de simbolos
   *  terminales, no terminales, producciones y el simbolo inicial axiomático, las validaciones de las reglas de
   * las gramáticas por ejemplo que los simbolo no terminales sean letras mayúsculas, están hechas en el
   * maquetado html mediante el uso de expresiones regulares
   * @param form formulario que viene del maquetado de HTML
   */
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

  /**
   * Este método obtiene todas las producciones que se ingresan en el campo de producciones, siendo agregadas
   * de forma dinámica a un arreglo de Producciones, en donde esta es una clase, además, teniendo en cuenta que
   * la clase Produccion contiene los atributos: Simbolo Terminal, arreglo de símbolos no terminales, con base en
   * esto, creamos una producción por cada uno de los campos del array que tomamos del formulario, cabe aclarar que
   * el array que obtenemos del formulario vienen como Strings sin tratamiento, por ejemplo 'A=1|0A', por tal razon
   * en este método hacemos la conversión a objetos
   */
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

  /**
   * vamos declarar el nodo cabeza o root, el cual tiene como valor, el simbolo inicial establecido
   *  en el formulario, agregamos un array, que serían sus hijos, además que son los datos que recibe la
   *  librería amchart para la graficación de un arbol
   */
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

  /**
   * el método hace la llamada recursiva para agregar los elementos de cada nodo(producciones por nodo)
   * resaltar que cada nodo es validado, de llegar a encontrar un simbolo no terminal en la produccion o nodo,
   * se hace el llamado recursivo para implementar sus producciones correspondinetes
   * @param noTer símbolo no Terminal al cual vamos a agregar sus respectivas producciones
   * @param child el array del elemento actual, el cual le vamos a agregar las producciones(hijos)
   * @param level el nivel arbol, tiene un tope, para terminar la llamada recursiva
   * @param i el index de cada nivel
   * @param acarreo el acarreo que trae el nivel directamente anterior
   */
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
/**
 * Limpia los campos del formulario cuando se ingresa una gramática correcta
 */
  limpiarCampos() {
    this.tree.simboloTer = '';
    this.tree.simboloNoTer = '';
    this.tree.simboloInicial = '';
    this.tree.simboloProducciones = '';
  }

  /**
   * 
   * @param form el formulario del maquetado HTML, de donde obtenemos el campo de la palabra que se ingresa a validar
   * Valida c que la palabra pertenezca al lenguaje, la palabra es validada mediante el array de palabras que se
   * genera apartir del arbol de derivacion
   */
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


  /**
   * Método de graficar el árbol, es el método de la librería de amcharts
   */
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
