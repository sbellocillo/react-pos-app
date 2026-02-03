import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { mySchema } from './schema';
import OfflineOrder from './model/OfflineOrder';
import Layout from './model/Layout'
import LayoutItem from './model/LayoutItem'

const adapter = new LokiJSAdapter({
    schema: mySchema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
})

export const database = new Database({
    adapter,
    modelClasses: [OfflineOrder, Layout, LayoutItem],
})