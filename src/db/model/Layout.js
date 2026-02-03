import { Model } from '@nozbe/watermelondb'
import { field, children } from '@nozbe/watermelondb/decorators'

export default class Layout extends Model {
  static table = 'offline_layouts'
  static associations = {
    offline_layout_items: { type: 'has_many', foreignKey: 'layout_id' },
  }

  @field('server_id') server_id
  @field('name') name
  @field('location_id') location_id
  @field('sort_order') sort_order
  
  @children('offline_layout_items') items
}