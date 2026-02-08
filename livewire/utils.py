import frappe,ast,json
from types import SimpleNamespace

logger_exception = frappe.logger("livewire.error", allow_site=True, file_count=50)
logger_exception.setLevel(20)


@frappe.whitelist()
def action_click(id):
    try:
        parts = id.split("-")
        
        live_notification=frappe.get_doc('Live Notification',parts[0])
        
        action=frappe.get_doc('Live Notification Actions',parts[1])
        
        
        code=execute_code(action.action_script,live_notification.live_param)
            
        
        data={"code":str(code),"can_close":action.can_close}
        
        return data
    except Exception as e :
        logger_exception.error(f" file => utils.py action_click {id}  {frappe.get_traceback()} ")
        frappe.log_error(message= f" file => utils.py action_click {id}  {frappe.get_traceback()} ", title="LiveWire")  


def execute_code(code,parameter):
        try:
            data= ast.literal_eval(str(parameter))
            # Convert dict to object
            doc_obj = SimpleNamespace(**data)
            _locals = {
                "params": doc_obj
            }
            object_from_code = {}
    
            
            exec(code, _locals, object_from_code)
            return object_from_code
        except Exception as e :
            logger_exception.error(f" file => utils.py execute_code code {code}  parameter {parameter} {frappe.get_traceback()} ")
            frappe.log_error(message= f" file => utils.py execute_code code {code} parameter {parameter}  {frappe.get_traceback()} ", title="LiveWire")  

         
