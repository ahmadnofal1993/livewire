$(document).ready(function() {

    // this for reload all tabs when change company 
    window.addEventListener('storage', function(event) {
        // Check if the specific key 'frappe_broadcast_reload' changed
        if (event.key === 'frappe_broadcast_reload' && event.newValue) {
            
            console.log("Reload signal received from another tab.");

            // SAFETY CHECK: Don't reload if the user has unsaved data
            if (cur_frm && cur_frm.is_dirty()) {
                frappe.show_alert({
                    message: __("⚠️ Another tab triggered a reload, but you have unsaved changes here. Please save manually."),
                    indicator: 'orange'
                }, 8);
            } else {
                // If safe, reload the page
                frappe.show_alert({
                    message: __("Syncing with other tabs... reloading."),
                    indicator: 'blue'
                });
                
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        }
    });


    const original_clear_cache = frappe.ui.toolbar.clear_cache;

    // Redefine the function
    frappe.ui.toolbar.clear_cache = function() {
        // A. Update localStorage with current timestamp. 
        // This change triggers the 'storage' event in ALL other open tabs.
        localStorage.setItem('frappe_broadcast_reload', Date.now());

        // B. Call the original Frappe logic to clear cache and reload THIS tab
        original_clear_cache();
    };
 
    console.log("Initializing Socket Keep-Alive mechanism...");

    // Configuration
    const CHECK_INTERVAL = 600000    ; // Check every 10 mins

    /**
     * Logic to check status and force reconnect
     */
    function ensure_connection() {
        // Safety check: Ensure the user is actually logged in
        if (frappe.session.user === 'Guest') return;

        if (frappe.realtime && frappe.realtime.socket) {
            // If disconnected, try to reconnect
            if (!frappe.realtime.socket.connected) {
                console.warn("⚠️ Socket disconnected. Forcing reconnection...");
                
                // Method A: Built-in reconnect
                frappe.realtime.connect(); 
                
                // Method B: Brute force (if Method A fails)
                // Sometimes the socket manager needs a kick
                if (frappe.realtime.socket.io) {
                    frappe.realtime.socket.io.reconnection(true);
                    frappe.realtime.socket.open(); 
                }
            }
        }
    }

    // 1. Event: When the user switches back to this tab
    // Browsers often kill sockets in background tabs. This fixes that instantly.
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible') {
            console.log("Tab active: checking socket health.");
            ensure_connection();
        }
    });

    // 2. Event: Periodic Heartbeat
    // Checks connection every 5 seconds
    setInterval(ensure_connection, CHECK_INTERVAL);

    // 3. Event: Listen for disconnects specifically
    frappe.realtime.on('disconnect', () => {
        console.log("Socket event: disconnected. Scheduling reconnect...");
        setTimeout(ensure_connection, 1000);
    });
    
    // 4. Listen for reconnect_error to prevent infinite console spam if server is truly down
    if(frappe.realtime.socket) {
        frappe.realtime.socket.on('reconnect_error', (error) => {
            console.log("Server unreachable. Waiting...");
        });
    }
});