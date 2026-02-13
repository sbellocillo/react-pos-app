// src/pages/LayoutAssignment.jsx
import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import AssignmentPanel from '../components/layoutAssignment/AssignmentPanel';
import LocationSidebar from '../components/layoutAssignment/LocationSidebar';
import AssignLayoutModal from '../components/layoutAssignment/modals/AssignLayoutModal';
import '../styles/layouts.css';

const LayoutAssignment = () => {
    // --- Global State ---
    const [locations, setLocations] = useState([]);
    const [allLayouts, setAllLayouts] = useState([]); // All available menus
    const [assignments, setAssignments] = useState([]); // Currently active menus
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Derived
    const selectedLocation = locations.find(l => l.id === selectedLocationId);

    // --- Init ---
    useEffect(() => {
        const initData = async () => {
            try {
                const [layoutsRes, locsRes] = await Promise.all([
                    apiEndpoints.layouts.getAll(),
                    apiEndpoints.locations.getAll()
                ]);
                if (layoutsRes.data?.success) setAllLayouts(layoutsRes.data.data);
                if (locsRes.data?.success) setLocations(locsRes.data.data);
            } catch (err) {
                console.error("Init Error:", err);
            }
        };
        initData();
    }, []);

    // --- Logic ---
    const fetchAssignments = async (locId) => {
        setAssignments([]);
        try {
            const res = await apiEndpoints.layoutPosTerminal.getLayoutsByLocation(locId);
            if (res.data?.success) setAssignments(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLocationSelect = (locId) => {
        setSelectedLocationId(locId);
        fetchAssignments(locId);
    };

    const handleAssign = async (layoutId) => {
        if (!selectedLocationId) return;
        try {
            await apiEndpoints.layoutPosTerminal.assign({
                location_id: selectedLocationId,
                layout_id: layoutId
            });
            setIsModalOpen(false);
            fetchAssignments(selectedLocationId);
        } catch (err) {
            alert(err.response?.data?.message || "Assignment failed");
        }
    };

    const handleUnassign = async (layoutId) => {
        if (!window.confirm("Remove this layout from this location?")) return;
        try {
            await apiEndpoints.layoutPosTerminal.unassign({
                location_id: selectedLocationId,
                layout_id: layoutId
            });
            fetchAssignments(selectedLocationId);
        } catch (err) {
            alert("Failed to remove layout");
        }
    };

    return (
        <div className='assign-app-container'>
            <div className='assign-body-wrapper'>
                
                {/* Left: Location List */}
                <LocationSidebar 
                    locations={locations}
                    selectedLocationId={selectedLocationId}
                    onSelect={handleLocationSelect}
                />

                {/* Right: Active Assignments */}
                <AssignmentPanel 
                    selectedLocation={selectedLocation}
                    assignments={assignments}
                    onOpenModal={() => setIsModalOpen(true)}
                    onUnassign={handleUnassign}
                />
            </div>

            {/* Modal: Pick Layout */}
            <AssignLayoutModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                locationName={selectedLocation?.name}
                allLayouts={allLayouts}
                currentAssignments={assignments}
                onAssign={handleAssign}
            />
        </div>
    );
};

export default LayoutAssignment;