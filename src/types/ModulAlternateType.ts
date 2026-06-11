export type ModulAlternateType = {
    modul_id: number;
    modul_name: string;
    modul_link: string;
    modul_icon: string;
    modul_main_menu: number;
    modul_urutan: number;
    sub_menu: ModulAlternateType[] | null;
  };