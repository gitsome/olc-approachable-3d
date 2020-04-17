import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class ModelLoaderService {

  private modelCache: {[key: string]: any} = {};

  public getModelScene (modelPath: string): Promise<any> {
    if (this.modelCache[modelPath]) {
      return Promise.resolve(this.modelCache[modelPath].clone());
    } else {

      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(modelPath, (gltf) => {
          this.modelCache[modelPath] = gltf.scene;
          resolve(this.modelCache[modelPath].clone());
        });
      });
    }
  }

}

export default new ModelLoaderService();