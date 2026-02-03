import { database } from '../db';
import { apiEndpoints } from './api';
import { Q } from '@nozbe/watermelondb'; 

export const MenuSync = {
    syncMenu: async (locationId) => {
        try {
            console.log("🔄 Starting Menu Sync (Sequential Mode)...");
            
            // 1. GET LAYOUTS
            const layoutsRes = await apiEndpoints.layouts.getByLocation(locationId);
            if (!layoutsRes.data.success) return;
            const layouts = layoutsRes.data.data;

            // 2. GET ITEMS (SEQUENTIALLY - One by One)
            // This prevents "500 Internal Server Error" from overloading the backend
            const layoutsWithItems = [];
            
            for (const layout of layouts) {
                try {
                    console.log(`⬇️ Fetching items for: ${layout.name}...`);
                    const itemsRes = await apiEndpoints.layoutPosTerminal.getByLayoutAndLocation(layout.id, locationId);
                    
                    layoutsWithItems.push({ 
                        ...layout, 
                        items: itemsRes.data.success ? itemsRes.data.data : [] 
                    });
                } catch (e) {
                    console.warn(`⚠️ Failed to fetch items for ${layout.name}`);
                    layoutsWithItems.push({ ...layout, items: [] });
                }
            }

            // 3. SAVE TO DB
            let totalItemsSaved = 0;
            await database.write(async () => {
                // Wipe old data
                const oldLayouts = await database.get('offline_layouts').query().fetch();
                const oldItems = await database.get('offline_layout_items').query().fetch();
                const deletions = [...oldLayouts, ...oldItems].map(rec => rec.prepareDestroyPermanently());

                const creations = [];
                
                for (const layoutData of layoutsWithItems) {
                    const newLayout = database.get('offline_layouts').prepareCreate(rec => {
                        rec.server_id = parseInt(layoutData.id); 
                        rec.name = layoutData.name;
                        rec.location_id = parseInt(locationId);
                        rec.sort_order = layoutData.sort_order || 0;
                    });
                    creations.push(newLayout);

                    for (const itemData of layoutData.items) {
                         totalItemsSaved++; 
                         const newItem = database.get('offline_layout_items').prepareCreate(rec => {
                             rec.layout_id = newLayout.id; 
                             // NEW: Save the Link ID explicitly as a number
                             rec.layout_server_id = parseInt(layoutData.id); 

                             rec.server_id = parseInt(itemData.id);
                             rec.item_id = itemData.item_id;
                             rec.item_name = itemData.item_name || itemData.name || "Unknown";
                             rec.price = parseFloat(itemData.price || 0);
                             rec.layout_indices_id = parseInt(itemData.layout_indices_id || 0);
                         });
                         creations.push(newItem);
                    }
                }
                await database.batch(...deletions, ...creations);
            });

            console.log(`✅ Menu Synced: ${layouts.length} Layouts and ${totalItemsSaved} Items saved.`);
            return true;
        } catch (error) {
            console.error("❌ Menu Sync Failed:", error);
            return false;
        }
    },

    getLayouts: async () => {
        try {
            const records = await database.get('offline_layouts').query().fetch();
            return records.map(r => ({ id: r.server_id, name: r.name })); 
        } catch (e) { return []; }
    },

    getItems: async (layoutServerId) => {
        try {
            console.log(`🔍 Querying items for Layout Server ID: ${layoutServerId}`);

            // SIMPLE FIX: Just look for items with that 'layout_server_id'
            // No need to look up the parent layout first!
            const items = await database.get('offline_layout_items').query(
                Q.where('layout_server_id', parseInt(layoutServerId))
            ).fetch();

            console.log(`✅ Found ${items.length} items.`);

            return items.map(i => ({
                id: i.server_id,
                item_id: i.item_id,
                item_name: i.item_name,
                price: i.price,
                layout_indices_id: i.layout_indices_id
            }));
        } catch (e) { 
            console.error("Error getting items:", e);
            return []; 
        }
    }
};