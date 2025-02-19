import { Box, Button } from '@mui/material';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { SqlColumn, SqlExecutionResponsePayload } from '../../../preload/index.d';

import camelCase from 'lodash.camelcase';
import { useTheme } from '@mui/material/styles';

interface ReportGridProps {
  sqlResults: SqlExecutionResponsePayload | undefined;
}

const baseColumn = {
  headerClassName: 'header bg-primary-default text-white',
  headerAlign: 'center' as const,
  align: 'center' as const,
  flex: 1,
};

const baseDateColumn = {
  ...baseColumn,
  type: 'date',
};

const sqlTypeMappings: Record<
  string,
  BooleanConstructor | NumberConstructor | StringConstructor | DateConstructor
> = {
  Bit: Boolean,
  BigInt: Number,
  Decimal: Number,
  Float: Number,
  Int: Number,
  Numeric: Number,
  SmallInt: Number,
  Money: Number,
  SmallMoney: Number,
  TinyInt: Number,
  Char: String,
  NChar: String,
  Text: String,
  NText: String,
  VarChar: String,
  NVarChar: String,
  Xml: String,
  Time: String,
  Date: Date,
  DateTime: Date,
  UniqueIdentifier: String,
};

type MappedColumnType = SqlColumn & {
  camelName: string;
  jsType: BooleanConstructor | NumberConstructor | StringConstructor | DateConstructor;
  validate: (value: string) => { valid: boolean; message?: string };
};

const mapColumnType = (col: SqlColumn): MappedColumnType => {
  return {
    ...col,
    camelName: camelCase(col.name),
    jsType: sqlTypeMappings[col.type],
    validate(value: string): { valid: boolean; message?: string } {
      return this.nullable
        ? { valid: true }
        : value === undefined || value === null || value === ''
          ? { valid: false, message: `${col.name} is required` }
          : { valid: true };
    },
  };
};

// type ColumType = {
//   camelName: string;
//   type: string;
// };

type DynamicObject = {
  [key: string]: string | number | boolean | Date;
};

const constructJson = (
  columns: Array<MappedColumnType>,
  recordset: Array<any>,
): Array<DynamicObject> => {
  const result = recordset.map((row) => {
    const obj: DynamicObject = {};
    columns.forEach((column: MappedColumnType, indexKey: number) => {
      if (['DateTime', 'Date'].includes(column.type) && row[indexKey]) {
        // Removing the final "Z" to stop timezone adjustment - which includes DST adjustment
        // obj[column.camelName] = new Date(row[indexKey].replace('Z', ''));
        obj[column.camelName] = new Date(row[indexKey]);
      } else if (column.type === 'Bit') obj[column.camelName] = !!row[indexKey];
      else obj[column.camelName] = row[indexKey];
    });
    return obj;
  });
  return result;
};

const getColumnDefinitions = (columns: MappedColumnType[]): any[] => {
  return columns.map((col) => {
    let definition: any = {
      ...baseColumn,
      headerName: col.name,
      field: col.camelName,
      hide: col.name.startsWith('_'),
      type: typeof col.jsType(),
    };

    if (col.type === 'DateTime' || col.type === 'Date') {
      definition = { ...definition, ...baseDateColumn };
    }

    if (col.name === 'Edit') {
      definition = {
        ...definition,
        field: '',
        sortable: false,
        filterable: false,
        renderCell: (): JSX.Element => (
          <Button
            size="small"
            variant="contained"
            className="from-primary-darkest to-primary-dark mb-2 mt-2 !rounded-lg bg-gradient-to-b text-xs disabled:!text-gray-300 disabled:opacity-60"
            onClick={(): void => console.log('handleEditClick')}
          >
            Edit
          </Button>
        ),
      };
    }

    return definition;
  });
};

const ReportGrid: React.FC<ReportGridProps> = ({ sqlResults }) => {
  const [isMounted, setIsMounted] = useState<boolean>(true);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [columnDefinitions, setColumnDefinitions] = useState<any[]>([]);

  const CustomToolbar: React.FC = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  const theme = useTheme();

  const backgroundColor = theme.palette.mode === 'dark' ? '#1e1e1e' : '#f7f9fc'; // Dark mode -> Dark Grey, Light mode -> Light Grey
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000'; // Dark mode -> White text, Light mode -> Black text
  const borderColor = theme.palette.mode === 'dark' ? '#444' : '#ddd'; // Dark mode -> Dark border, Light mode -> Light border

  useEffect(() => {
    setIsMounted(true);

    const loadReport = async (): Promise<void> => {
      if (!sqlResults) return;
      setLoading(true);
      try {
        if (isMounted) {
          const columnsMappedAsType = [
            ...sqlResults.columns,
            {
              name: 'index',
              field: 'index',
              type: 'Numeric',
              nullable: false,
              length: 0,
              precision: 0,
              scale: 0,
            },
          ].map(mapColumnType);

          const columnDefs = getColumnDefinitions(columnsMappedAsType);
          setColumnDefinitions(columnDefs);

          const mappedRowsWithIndex = sqlResults.recordset.map((row: any, index: number) => ({
            ...row,
            [row.length]: index,
          }));
          setRows(constructJson(columnsMappedAsType, mappedRowsWithIndex));
        }
      } finally {
        setLoading(false);
      }
    };

    loadReport();

    return (): void => {
      setIsMounted(false);
    };
  }, [sqlResults]);

  return (
    <>
      {loading && 'loading...'}
      {!loading && rows.length === 0 && (
        <div className="flex justify-center">
          <div
            className={`header-panel ${columnDefinitions.length === 0 ? 'bg-primary-warning' : 'bg-primary-default'}`}
          >
            <p className="text-2xl text-white">
              {columnDefinitions.length === 0 ? '' : 'No Data Found'}
            </p>
          </div>
        </div>
      )}
      {!loading && rows.length > 0 && columnDefinitions.length > 0 && (
        <div className="flex justify-center">
          <div style={{ height: 'calc(100vh - 200px)' }} className="w-full">
            <Box
              sx={{
                height: 'calc(100vh - 200px)',
                width: '100%',
                backgroundColor,
                color: textColor,
                border: `1px solid ${borderColor}`,
                '& .MuiDataGrid-root': {
                  backgroundColor, // Apply to DataGrid
                },
              }}
            >
              <DataGrid
                sx={{
                  backgroundColor: '#f7f9fc', // Slightly different from white
                  border: '1px solid #ddd', // Subtle border to separate from background
                }}
                rows={rows || []}
                getRowId={(row): number => row.index}
                columns={columnDefinitions}
                rowHeight={40}
                density="compact"
                slots={{ toolbar: CustomToolbar }}
                rowCount={rows.length || 0}
                paginationMode="client"
              />
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportGrid;
