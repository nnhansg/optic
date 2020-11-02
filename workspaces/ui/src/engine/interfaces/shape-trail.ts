export type IShapeTrailComponent =
  | IObjectTrail
  | IOneOfItemTrail
  | IObjectFieldTrail
  | IListTrail
  | IListItemTrail
  | INullableTrail
  | IOptionalItemTrail
  | INullableItemTrail
  | IUnknownTrail;

//todo one time export from scala js, switch to types from Rust

export interface IShapeTrail {
  rootShapeId: string;
  path: IShapeTrailComponent[];
}

// Individual Trails
export interface IObjectTrail {
  ObjectTrail: {
    shapeId: string;
  };
}

export interface IOneOfItemTrail {
  OneOfItemTrail: {
    oneOfId: string;
    parameterId: string;
    itemShapeId: string;
  };
}

export interface IObjectFieldTrail {
  ObjectFieldTrail: {
    fieldId: string;
    fieldShapeId: string;
  };
}

export interface IListTrail {
  ListTrail: {
    shapeId: string;
  };
}

export interface IListItemTrail {
  ListItemTrail: {
    listShapeId: string;
    itemShapeId: string;
  };
}

export interface INullableTrail {
  NullableTrail: {
    shapeId: string;
  };
}

export interface IOptionalItemTrail {
  OptionalItemTrail: {
    shapeId: string;
    innerShapeId: string;
  };
}

export interface INullableItemTrail {
  NullableItemTrail: {
    shapeId: string;
    innerShapeId: string;
  };
}

export interface IUnknownTrail {
  UnknownTrail: {};
}

export interface IOneOfTrail {
  IOneOfTrail: {
    shapeId: string;
  };
}

export interface IOptionalTrail {
  IOptionalTrail: {
    shapeId: string;
  };
}