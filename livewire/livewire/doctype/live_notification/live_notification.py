# Copyright (c) 2025, ItsPrivate and contributors
# For license information, please see license.txt

import frappe,ast
from frappe.model.document import Document
from types import SimpleNamespace
from livewire.utils import execute_code
logger_exception = frappe.logger("livewire.error", allow_site=True, file_count=50)
logger_exception.setLevel(20)

class LiveNotification(Document):
	def after_insert(self): 
		try:
			notification_type=frappe.get_cached_doc('Live Notification Type',self.notification_type)
		
			
		
			#frappe.publish_realtime('livewire_notification', data)
			for user in self.notification_user:
				print(user.live_notifi_user)
				frappe.local.lang=frappe.db.get_value("User", user.live_notifi_user, "language") or "en"
				object_from_code =execute_code(notification_type.live_script,self.live_param)
				data={'message':object_from_code['message'],'indicator':notification_type.scheme,
				'duration':notification_type.duration,'allow_close':notification_type.can_close,'icon':notification_type.icon,
				'icon_size':notification_type.icon_size,'actions':self.get_action()
				}
				print(data)
				frappe.publish_realtime('livewire_notification', data,user=user.live_notifi_user)
		except Exception as e :
			logger_exception.error(f" file => livenotification.py  after_insert  self {self}  {frappe.get_traceback()} ")
			frappe.log_error(message= f" file => livenotification.py after_insert  self  {self}   {frappe.get_traceback()} ", title="LiveWire")  

         
			
	
	def get_action(self):
		try:
			notification_type=frappe.get_cached_doc('Live Notification Type',self.notification_type)
			lst = ast.literal_eval(notification_type.actions_array)
			actions = [self.name+"-" + item for item in lst]
			return actions
		except Exception as e :
			logger_exception.error(f" file => livenotification.py  get_action  self {self}  {frappe.get_traceback()} ")
			frappe.log_error(message= f" file => livenotification.py get_action self  {self}   {frappe.get_traceback()} ", title="LiveWire")  

         
			