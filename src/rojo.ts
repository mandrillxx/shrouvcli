import defaultProjectJson from "./default.project.json" assert { type: "json" };

interface InstanceDescription {
  $className: string;
  $path?: string;
  $properties?: { [key: string]: InstanceDescription };
}

interface RojoProjectConfig {
  name: string;
  tree: InstanceDescription;
}

export function createRojoProjectConfig(projectName: string) {
  return {
    ...defaultProjectJson,
    name: projectName,
  };
}
