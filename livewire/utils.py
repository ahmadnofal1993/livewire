import frappe,ast,json
from types import SimpleNamespace
logger = frappe.logger("livewire", allow_site=True, file_count=50)
logger.setLevel(20)
logger_exception = frappe.logger("livewire.error", allow_site=True, file_count=50)
logger_exception.setLevel(20)


@frappe.whitelist()
def action_click(id):
    parts = id.split("-")
    
    live_notification=frappe.get_doc('Live Notification',parts[0])
    
    action=frappe.get_doc('Live Notification Actions',parts[1])
    logger.info(f"action click for {id} the live notification is {live_notification.name} the action is {action.name}")
    try:
        code=execute_code(action.action_script,live_notification.live_param)
        logger.info(f"action click for {id} the live notification is {live_notification.name} the action is {action.name} return code {code} can_close {action.can_close} json code {str(code)}")
    except Exception as e :
        logger_exception.error(f" action id error {id}  {frappe.get_traceback()} ")
        frappe.log_error(message= f" action id error {id}  {frappe.get_traceback()} ", title="LiveWire")    
    data={"code":str(code),"can_close":action.can_close}
    
    return data

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
         
