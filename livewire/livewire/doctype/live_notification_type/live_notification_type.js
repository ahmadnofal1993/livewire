// Copyright (c) 2025, ItsPrivate and contributors
// For license information, please see license.txt

 frappe.ui.form.on("Live Notification Type", {
  refresh(frm){
    if (frm.doc.icon != undefined )
    {
      let a=  frappe.utils.icon(frm.doc.icon, 'lg');
        frm.fields_dict.icon_display.$wrapper.html(`
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px; /* Full screen height */
            text-align: center;">
            <div>
             `+a+` 
            </div>
        </div>
        `);
    }
  }
  ,
 	icon(frm) {
        console.log(frm.doc.icon);
      let a=  frappe.utils.icon(frm.doc.icon, 'lg');
        frm.fields_dict.icon_display.$wrapper.html(`
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px; /* Full screen height */
            text-align: center;">
            <div>
             `+a+` 
            </div>
        </div>
        `);
                  
                },
        
 	},
  );
