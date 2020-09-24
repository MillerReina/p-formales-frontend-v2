import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-re',
  templateUrl: './re.component.html',
  styleUrls: ['./re.component.scss'],
  styles: [
  ]
})
export class ReComponent implements OnInit {

  msg="";
  coincide=false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: { value: { reg: string | RegExp; }; },divtext: any) {

    var str = divtext.innerHTML;
    let er = new RegExp(form.value.reg,"\g");
    var myArray;
    var aux = 0;
    var count = 0;
    while ((myArray = er.exec(str)) !== null) {
      var i = er.lastIndex-myArray[0].length;
      var j =  er.lastIndex;
      divtext.innerHTML=divtext.innerHTML.slice(0,i+aux) + "<span style=\"color:green;\">"+divtext.innerHTML.slice(i+aux);
      divtext.innerHTML=divtext.innerHTML.slice(0,j+27+aux) + "</span>"+divtext.innerHTML.slice(j+27+aux);
      aux+=34;
      count++;
    }
    this.coincide = er.test(str);
    if(this.coincide){
      this.msg="Se encontró "+count+" coincidencias";
    }else{
      this.msg="No hay coincidencias";
    }
  }

  comp(divtext){
    divtext.innerHTML="";
  }
}
