import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class OfflineOrder extends Model {
    static table = 'offline_orders'

    @field('offline_uuid') offline_uuid
    @field('payload') payload
    @date('created_at') created_at
}