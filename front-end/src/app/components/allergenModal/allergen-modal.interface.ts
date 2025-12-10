export interface TableColumn {
  key: string;      // Klíč z dat (např. 'name' nebo 'code')
  label: string;    // Zobrazovaný název sloupce (např. 'Název alergenu')
  width?: string;   // Volitelné: šířka sloupce (např. '70px', 'auto')
}

export interface GenericTableData {
  [key: string]: any;
}