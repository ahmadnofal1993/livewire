# Copyright (c) 2025, ItsPrivate and contributors
# For license information, please see license.txt

import frappe,ast
from frappe.model.document import Document
from types import SimpleNamespace
from livewire.utils import execute_code

class LiveNotification(Document):
	def after_insert(self): 
		notification_type=frappe.get_cached_doc('Live Notification Type',self.notification_type)
		object_from_code =execute_code(notification_type.live_script,self.live_param)
		print(str(object_from_code))
		data={'message':object_from_code['message'],'indicator':notification_type.scheme,
		'duration':notification_type.duration,'allow_close':notification_type.can_close,'icon':notification_type.icon,
		'icon_size':notification_type.icon_size,'actions':self.get_action()
		}
		print(data)
		frappe.publish_realtime('livewire_notification', data)
		for user in self.notification_user:
			print(user.live_notifi_user)
			frappe.publish_realtime('livewire_notification', data,user.live_notifi_user)
			
	
	def get_action(self):
		notification_type=frappe.get_cached_doc('Live Notification Type',self.notification_type)
		lst = ast.literal_eval(notification_type.actions_array)
		actions = [self.name+"-" + item for item in lst]
		return actions
			