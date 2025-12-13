(() => {
  // ../livewire/livewire/public/js/livewire.bundle.js
  frappe.provide("crm");
  on_answer_click = function(id, btn) {
    let parent = btn.parentElement.parentElement.parentElement;
    frappe.call({
      method: "livewire.utils.action_click",
      args: {
        id
      },
      callback: function(r) {
        if (!r.exc) {
          console.log(r.message);
          if (r.message[0].hasOwnProperty("href")) {
            console.log("Href found:", r.message[0].href);
          } else if (r.message[0].hasOwnProperty("result")) {
            console.log("Result found:", r.message[0].result);
          }
          if (r.message[1] == 1) {
            $(parent).addClass("out");
            setTimeout(() => parent.remove(), 800);
          }
        }
      }
    });
  };
  var OriginalApplication = frappe.Application;
  crm.show_alert = function(message, seconds = 7, allow_close = true, icon, icon_size, live_actions = {}) {
    let indicator_icon_map = {
      orange: "solid-warning",
      yellow: "solid-warning",
      blue: "solid-info",
      green: "solid-success",
      red: "solid-error"
    };
    if (typeof message === "string") {
      message = {
        message
      };
    }
    if (!$("#dialog-container").length) {
      $('<div id="dialog-container"><div id="alert-container"></div></div>').appendTo("body");
    }
    const indicator = message.indicator || "blue";
    let action_section = "";
    for (let i = 0; i < live_actions.length; i++) {
      let parts = live_actions[i].split("-");
      let isPrimary = parts[3] == "1";
      let btnClass = isPrimary ? "btn btn-xs btn-primary" : "btn btn-xs btn-secondary";
      action_section += `
        <button style="padding:0px 12px;" 
                id="${parts[0]}-"${parts[1]} 
                class="${btnClass}" 
                onclick="on_answer_click('${parts[0]}-${parts[1]}',this)">
				${parts[2]}
        </button>`;
    }
    const div = $(`
		<div class="alert desk-alert ${indicator}" role="alert">
			<div class="alert-message-container">
				<div class="alert-title-container">
					<div>${frappe.utils.icon(icon, icon_size)}</div>
					<div class="alert-message">${message.message}</div>
				</div>
				<div class="alert-subtitle">${message.subtitle || ""}</div>
				<div id=actions style='margin-top: 25px;'>
				 
				</div>
			</div>
			<div class="alert-body" style="display: none"></div>
			
		</div>
	`);
    div.find("#actions").append(action_section);
    if (allow_close == true) {
      div.append(`<a class="close">${frappe.utils.icon("close-alt")}</a>`);
      div.find(".close, button").click(function() {
        div.addClass("out");
        setTimeout(() => div.remove(), 800);
        return false;
      });
    }
    div.hide().appendTo("#alert-container").show();
    if (message.body) {
      div.find(".alert-body").show().html(message.body);
    }
    if (seconds > 2) {
      seconds = seconds - 0.8;
    }
    setTimeout(() => {
      div.addClass("out");
      setTimeout(() => div.remove(), 800);
      return false;
    }, seconds * 1e3);
    return div;
  };
  frappe.Application = class CustomApplication extends OriginalApplication {
    constructor(...args) {
      super(...args);
      console.log("Custom Application constructor called");
      this.show_pending_notifications();
    }
    show_pending_notifications() {
      console.log("Custom notification logic");
      if (super.show_pending_notifications) {
        super.show_pending_notifications();
      }
      frappe.realtime.on("livewire_notification", function(data) {
        console.log(data);
        let icon = frappe.utils.icon("phone", "sm");
        let icon2 = frappe.utils.icon("phone", "sm");
        let btn_id = "btn-answer-" + frappe.utils.get_random(5);
        let safe_caller = data["data2"];
        let message_html = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span>
                        Incoming Call: <b>${safe_caller || "Unknown"}</b>
                    </span>
                    <button id="${btn_id}" class="btn btn-xs btn-secondary"  onclick="on_answer_click('${safe_caller}')">
                        ${frappe.utils.icon("call", "sm")} Answer
                    </button>
                </div>
            `;
        crm.show_alert({
          message: data.message,
          indicator: data.indicator
        }, data.duration, data.allow_close, data.icon, data.icon_size, data.actions);
      });
    }
  };
})();
//# sourceMappingURL=livewire.bundle.66MO54OP.js.map
