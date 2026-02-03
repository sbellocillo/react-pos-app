import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 3, // <--- INCREMENT THIS to 3
  tables: [
    tableSchema({
      name: 'offline_orders',
      columns: [
        { name: 'offline_uuid', type: 'string' },
        { name: 'payload', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'offline_layouts',
      columns: [
        { name: 'server_id', type: 'number', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'location_id', type: 'number' },
        { name: 'sort_order', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'offline_layout_items',
      columns: [
        { name: 'server_id', type: 'number', isIndexed: true },
        // NEW COLUMN: We will link using this simple number
        { name: 'layout_server_id', type: 'number', isIndexed: true }, 
        
        { name: 'layout_id', type: 'string', isIndexed: true }, // Keep this just in case
        { name: 'item_id', type: 'number' },
        { name: 'item_name', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'layout_indices_id', type: 'number' },
      ],
    }),
  ],
})