export type ModulType = {
  ModulId: number;
  ModulName: string;
  ModulLink: string;
  ModulIcon: string;
  ModulMainMenu: number;
  ModulUrutan: number;
  SubMenu: ModulType[] | null;
};
