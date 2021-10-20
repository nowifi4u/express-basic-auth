export function hasOwnProperty(target: any, key: any): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export type MapperType<T, nT> = (val: T, key?: any) => nT;

export type MappedObject<O, T> = { [key in keyof O]-?: T };

export type MappedObjectKeys<O> = Extract<keyof O, any>;
export type MappedObjectValues<O> = O[MappedObjectKeys<O>];

export function objectMap<O, nT>(source: O, mapper: MapperType<MappedObjectValues<O>, nT>): MappedObject<O, nT> {
  const output = {};
  for (const key in source) {
    if (!hasOwnProperty(source, key)) continue;
    Object.assign(output, { [key]: mapper(source[key], key) });
  }
  return output as MappedObject<O, nT>;
}
