# Copyright (c) 2025, ItsPrivate and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class LiveNotificationType(Document):
	def on_update(self):
		actions=[]
		for action in self.actions:
			actions.append(str(action.name)+'-'+str(action.action)+'-'+str(action.focus))
		self.db_set('actions_array',str(actions),False,False,True)