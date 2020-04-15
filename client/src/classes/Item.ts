
class Annotation {
  public color: string = '#CCCCCC';
  public highlightColor: string = '#007bff';
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;
  public label: string = '';
  public description: string[] = [''];
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

export { Model, Annotation };