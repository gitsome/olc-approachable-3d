import EventEmitter from 'events';

interface IStateStoreMap {
  [key: string]: StateStore;
}

interface IUpdateConfig {
  [key: string]: any;
}

const StateStoreReservedKeys = ['asyncState'];

class StateStore extends EventEmitter {

  private reactivePropertiesList: string[];
  private reactiveRequestPropertiesList: string[];
  private cachedStateSnapshot: undefined | object;
  private requestProcessingSnapshots: object;
  private stateIsDirty: boolean;

  constructor (reactiveProperties: any) {
    super();

    this.stateIsDirty = false;

    this.reactivePropertiesList = [];
    this.reactiveRequestPropertiesList = [];

    this.cachedStateSnapshot = undefined;
    this.requestProcessingSnapshots = {};

    const wrapUpdate = (updateFunction: any) => {
      return (newValue: any) => {
        this.cachedStateSnapshot = undefined;
        this.requestProcessingSnapshots = {};
        updateFunction(newValue);
      };
    };

    Object.keys(reactiveProperties).forEach((propName) => {

      // the "asyncState" property is a reservered word so we ignore it and process regular reactiveProperties
      if (propName !== 'asyncState') {

        // property
        (this as any)[propName] = reactiveProperties[propName];
        this.reactivePropertiesList.push(propName);

        // property update method
        (this as any)[`${propName}Update`] = wrapUpdate((newValue: any) => {
          if (newValue === (this as any)[propName]) return;
          (this as any)[propName] = newValue;
          this.emit('update', (this as any)[propName]);
          this.emit(`${propName}Updated`, (this as any)[propName]);
        });
      }
    });

    if (reactiveProperties.asyncState && typeof reactiveProperties.asyncState === 'object') {

      // here is where we look for the reserverd word of asyncState and process them with additional observables for async behavior
      Object.keys(reactiveProperties.asyncState).forEach((propName: string) => {

        // asyncState property
        (this as any)[propName] = reactiveProperties.asyncState[propName];
        this.reactivePropertiesList.push(propName);
        this.reactiveRequestPropertiesList.push(propName);

        // asyncState property update method
        (this as any)[`${propName}Update`] = wrapUpdate((newValue: any) => {
          if (newValue === (this as any)[propName]) return;
          (this as any)[propName] = newValue;
          this.emit('update', (this as any)[propName]);
          this.emit(`${propName}Updated`, (this as any)[propName]);
        });

        // asyncState error property and default to false
        (this as any)[`${propName}Error`] = false;
        this.reactivePropertiesList.push(`${propName}Error`);
        this.reactiveRequestPropertiesList.push(`${propName}Error`);

        // asyncState error property update method
        (this as any)[`${propName}ErrorUpdate`] = wrapUpdate((newValue: any) => {
          if (newValue === (this as any)[propName]) return;
          (this as any)[`${propName}Error`] = newValue;
          this.emit('update', (this as any)[`${propName}Error`]);
          this.emit(`${propName}ErrorUpdated`, (this as any)[`${propName}Error`]);
        });

        // asyncState loading property and default to false
        (this as any)[`${propName}Loading`] = false;
        this.reactivePropertiesList.push(`${propName}Loading`);
        this.reactiveRequestPropertiesList.push(`${propName}Loading`);

        // asyncState loading property update method
        (this as any)[`${propName}LoadingUpdate`] = wrapUpdate((newValue: any) => {
          if (newValue === (this as any)[propName]) return;
          (this as any)[`${propName}Loading`] = newValue;
          this.emit('update', (this as any)[`${propName}Loading`]);
          this.emit(`${propName}LoadingUpdated`, (this as any)[`${propName}Loading`]);
        });
      });
    }
  }

  private getStateSnapshot () {

    if (this.cachedStateSnapshot === undefined) {
      this.cachedStateSnapshot = this.reactivePropertiesList.reduce((props, propName) => {
        (props as any)[propName] = (this as any)[propName];
        return props;
      }, {});

      this.stateIsDirty = false;
    }

    return this.cachedStateSnapshot;
  }

  // create an immutable copy of state for react's change detection
  public get () {
    return JSON.parse(JSON.stringify(this.getStateSnapshot()));
  }

  /**
   * This method is convenient for locking down behavior when some async process is going on. It can be scoped to a subset of the requestFlag properties
   * requestPropertiesFilterString - a string that contains . seperated property keys to filter on 'isCloning.isUpdating'
   */
  public isRequestProcessing (requestPropertiesFilterString: string) {

    if ((this.requestProcessingSnapshots as any)[requestPropertiesFilterString] === undefined) {
      (this.requestProcessingSnapshots as any).requestPropertiesFilterString = this.reactiveRequestPropertiesList.reduce((hasRequestProcessing, asyncProp) => {
        const isRequestPropertyProcessing = requestPropertiesFilterString ? (requestPropertiesFilterString.indexOf(asyncProp) !== -1 && (this as any)[asyncProp]) : (this as any)[asyncProp];
        return hasRequestProcessing || isRequestPropertyProcessing;
      }, false);
    }

    return (this.requestProcessingSnapshots as any)[requestPropertiesFilterString];
  }

  // a way to set a group of state keys at once to avoid listener race conditions
  public update (updateConfig: IUpdateConfig) {
    const keys = Object.keys(updateConfig);

    let wasUpdated = false;
    const wasUpdatedMap = {};

    keys.forEach((key) => {
      (wasUpdatedMap as any)[key] = ((this as any)[key] !== updateConfig[key]);
      wasUpdated = wasUpdated || (wasUpdatedMap as any)[key];
      (this as any)[key] = updateConfig[key];
    });

    this.cachedStateSnapshot = undefined;
    this.requestProcessingSnapshots = {};

    keys.forEach((key) => {
      if ((wasUpdatedMap as any)[key]) {
        this.emit(`${key}Updated`, (this as any)[key]);
      }
    });

    if (wasUpdated) {
      this.emit('update');
    }
  }

  // Sometimes you have modified a nested property and need to trigger a state change at the root level of the property
  public triggerUpdate (propertyName: string) {

    if (this.reactivePropertiesList.includes(propertyName)) {
      this.emit(`updated`, (this as any)[propertyName]);
      this.emit(`${propertyName}Updated`);
    } else {
      throw new Error(`Attempt to trigger update for property ${propertyName} failed because it is not a registered reactive property`);
    }
  }

  // bind state updates to this component (great for using context api)
  public linkToComponentState (statePropertyValue: string, componentReference: any) {

    componentReference.state = componentReference.state || {};
    componentReference.state[statePropertyValue] = this.get();

    componentReference.linkReactSimpleState = () => {
      componentReference.setState({
        [statePropertyValue]: this.get()
      });
    };

    this.on('update', componentReference.linkReactSimpleState);
  }

  // used if the component you bind to can get removed (should be run on componentWillUnmount)
  public unlinkToComponentState (componentReference: any) {
    this.removeListener('update', componentReference.linkReactSimpleState);
  }
}

export default StateStore;

export { StateStore, StateStoreReservedKeys };