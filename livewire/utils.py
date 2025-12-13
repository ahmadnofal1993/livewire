import frappe,ast
from types import SimpleNamespace

@frappe.whitelist()
def action_click(id):
    parts = id.split("-")
    live_notification=frappe.get_doc('Live Notification',parts[0])
    action=frappe.get_doc('Live Notification Actions',parts[1])
    code=execute_code(action.action_script,live_notification.live_param)
    return code,action.can_close

def execute_code(code,parameter):
        data= ast.literal_eval(str(parameter))
		# Convert dict to object
        doc_obj = SimpleNamespace(**data)
        _locals = {
			"params": doc_obj
		}
        object_from_code = {}
        
        exec(code, _locals, object_from_code)
        return object_from_code
         
