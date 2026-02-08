# Copyright (c) 2025, ItsPrivate and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
logger_exception = frappe.logger("livewire.error", allow_site=True, file_count=50)
logger_exception.setLevel(20)


class LiveNotificationType(Document):
	def on_update(self):
		try:
			actions=[]
			for action in self.actions:
				actions.append(str(action.name)+'-'+str(action.action)+'-'+str(action.focus)+'-'+str(action.style))
			self.db_set('actions_array',str(actions),False,False,True)
		except Exception as e :
			logger_exception.error(f" file => livenotificationtype.py   self {self}  {frappe.get_traceback()} ")
			frappe.log_error(message= f" file => livenotificationtype.py  self  {self}   {frappe.get_traceback()} ", title="LiveWire")  

         