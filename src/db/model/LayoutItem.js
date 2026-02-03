import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class LayoutItem extends Model {
  static table = 'offline_layout_items'
  static associations = {
    offline_layouts: { type: 'belongs_to', key: 'layout_id' },
  }

  @field('server_id') server_id
  @field('layout_server_id') layout_server_id // <--- ADD THIS
  @field('item_id') item_id
  @field('item_name') item_name
  @field('price') price
  @field('layout_indices_id') layout_indices_id
  
  @relation('offline_layouts', 'layout_id') layout
}