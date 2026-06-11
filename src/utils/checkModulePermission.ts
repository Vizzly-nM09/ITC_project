import { ModulType } from "@/types/ModulType";

export const checkModulePermission = (
  moduleList: ModulType[],
  modulePath: string
) => {
  try {
    let hasPermission = moduleList.some((modul: ModulType) =>
      new RegExp(`^${modul.ModulLink}`).test(modulePath)
    );

    if (!hasPermission) {
      hasPermission = moduleList.some((modul: ModulType) =>
        modul.SubMenu?.some((subModul) =>
          new RegExp(`^${subModul.ModulLink}`).test(modulePath)
        )
      );
    }
    return hasPermission;
  } catch (error) {
    return false;
  }
};
