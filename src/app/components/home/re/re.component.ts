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

  onSubmit(form: { value: { reg: string | RegExp; intext: string; }; }) {
    let er = new RegExp(form.value.reg);
    this.coincide = er.test(form.value.intext);
    if(this.coincide){
      this.msg="Coincide";
    }else{
      this.msg="No coincide";
    }
    console.log('Test: ',er.test("abababc")," | exp: ",form.value.reg);
  }

  comp(){
    console.log("Automata");
  }
}
