
interface Annotation {
  x: number;
  y: number;
  z: number;
  label: string;
  description: string[];
}

class Model {
  public location: string = '';
  public rotation: number[] = [0,0,0];
  public translation: number[] = [0,0,0];
  public scale: number = 1;
}

class Item {
  public name: string = '';
  public description: string[] = [''];
  public model: Model = new Model();
  public annotations: Annotation[] = [];
}

export default Item;