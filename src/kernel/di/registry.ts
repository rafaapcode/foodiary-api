type Constructor<T  = any> = new (...args: any) => T;

export class Registry {
  private readonly providers =  new Map<string, Registry.Provider>();

  register(impl: Constructor) {
    const token = impl.name;

    if(this.providers.has(token)) {
      throw new Error(`"${token}" is already registered in the registry`);
    }

    const paramTypes = Reflect.getMetadata('design:paramtypes', impl) ?? [];
    const deps = paramTypes.filter(Boolean);

    this.providers.set(token, { impl, deps });
  }

  resolve<TImpl extends Constructor>(impl: TImpl): InstanceType<TImpl>{
    const token = impl.name;
    const provider = this.providers.get(token);
    if(!provider) {
      throw new Error(`"${token}" is not registered in the registry`);
    }

    const deps = provider.deps.map(dep => this.resolve(dep));

    const instance = new provider.impl(...deps);

    return instance;
  }
}

export namespace Registry {
  export type Provider = {
    impl: Constructor;
    deps: Constructor[];
  };
};
