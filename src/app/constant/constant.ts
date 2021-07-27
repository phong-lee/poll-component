export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

export interface Person {
  name: string;
  isSelected: boolean;
  chosenSlider?: Slider
}

export interface Slider {
  name: string;
  editing: boolean;
  chosen: string[];
}

export interface Result {
  title: string;
  mostSliders: Slider[];
}
