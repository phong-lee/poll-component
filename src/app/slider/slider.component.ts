import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";
import {Person, Result, Slider} from "../constant/constant";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  providers: [],
})
export class SliderComponent implements OnInit, OnChanges {
  selectedPerson = {} as Person;
  personName = '';
  personList: Person[] = [];

  sliders: Slider[] = [
    {name: 'Saturday', editing: false, chosen: []},
    {name: 'Sunday', editing: false, chosen: []},
  ];

  title = 'When should we go hang out?';
  editTitle = false;
  date = new Date();
  displayDate = '';
  time = '03:21';
  regExp24h = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  expiredOn = '';
  @Output() onHavingResult: EventEmitter<Result> = new EventEmitter<Result>();
  @Input() refreshComponent = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.refreshComponent) {
      this.title = 'New poll!';
      this.sliders = [
        {name: 'option 1', editing: false, chosen: []},
        {name: 'option 2', editing: false, chosen: []},
      ];
      this.personList = [];
      this.expiredOn = '';
    }
  }

  ngOnInit(): void {
  }

  addPerson() {
    if (this.personName.trim().length === 0) {
      return;
    }
    this.personList.push({name: this.personName.trim(), isSelected: false});
    this.personName = '';
  }

  toggleSelected(person: Person) {
    if (this.selectedPerson === person) {
      this.selectedPerson.isSelected = false;
      this.selectedPerson = {} as Person;
      return;
    }

    if (this.selectedPerson !== person) {
      this.selectedPerson.isSelected = false;
    }
    this.selectedPerson = person;
    this.selectedPerson.isSelected = !this.selectedPerson.isSelected;
  }

  editSlider(slider: Slider) {
    slider.editing = true;
  }

  doneEdit(slider: Slider) {
    slider.editing = false;
  }

  addNewOption() {
    const newOption: Slider = {name: 'new option', editing: false, chosen: []};
    this.sliders.push(newOption);
  }

  deleteSlider(slider: Slider) {
    this.sliders = this.sliders.filter(sld => sld !== slider);
    this.personList.map(person => {
      if (person.chosenSlider === slider) {
        delete person.chosenSlider;
      }
      return person;
    })
  }

  choseOption(slider: Slider) {
    if (!Object.keys(this.selectedPerson).length)
      return;
    if (this.selectedPerson.chosenSlider === slider) {
      delete this.selectedPerson.chosenSlider;
      slider.chosen = slider.chosen.filter(name => this.selectedPerson.name !== name);
      return;
    }
    if (this.selectedPerson.chosenSlider) {
      const prevSlider = this.sliders.filter(sld => this.selectedPerson.chosenSlider === sld)[0];
      prevSlider.chosen = prevSlider.chosen.filter(name => this.selectedPerson.name !== name);
    }

    slider.chosen = slider.chosen.filter(name => this.selectedPerson.name !== name);
    this.selectedPerson.chosenSlider = slider;
    slider.chosen.push(this.selectedPerson.name.trim());
  }

  deletePerson(person: Person) {
    this.personList = this.personList.filter(ps => person !== ps);
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.displayDate = moment(event.value).format('DD/MM/yyyy');
  }

  intervalId: any;

  setTime() {
    clearInterval(this.intervalId);
    const mostSlider: Slider = this.sliders.reduce((prev, cur) => prev.chosen.length > cur.chosen.length ? prev : cur);
    const mostSliders = this.sliders.filter(sldr => mostSlider.chosen.length === sldr.chosen.length);
    try {
      if (!this.sliders.some(sldr => sldr.chosen.length > 0)) {
        throw 'Please select at least one option!';
      }
      const theDate = moment(this.date).format('YYYYMMDD');
      const theDateTime = moment(theDate + this.time, 'YYYYMMDD hh:mm');
      if (!this.regExp24h.test(this.time) || !theDateTime.isValid()) {
        throw 'Wrong time!';
      }
      this.expiredOn = theDateTime.format('hh:mm dddd MMMM YYYY').toString();
      let duration = moment.duration(theDateTime.diff(moment()));
      if (duration.asMinutes() < 0) {
        throw 'Please choose a greater time!';
      }
      this.intervalId = setInterval(() => {
        duration = moment.duration(theDateTime.diff(moment()));
        if (Math.ceil(duration.asMinutes()) === 0) {
          clearInterval(this.intervalId);
          this.onHavingResult.emit({title: this.title, mostSliders: mostSliders});
        }
      }, 1000);
    } catch (e) {
      this.expiredOn = e;
    }
  }

  timeChanged(event: any) {
    this.regExp24h.test(event);
  }
}
