import services from "../../../modules/services.json" assert { type: "json" };

export interface ServiceList {
  default: string[];
  recommended: Array<string | string[]>;
}

export function getServices(): string[] {
  const { recommended } = services as ServiceList;
  return recommended.flat();
}

export function getDefaultServices(): string[] {
  return services.default;
}
