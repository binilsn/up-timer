import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "events", "checkbox" ]

  toggle(event) {
    const checked = event.target.checked
    if (this.hasEventsTarget) {
      this.eventsTarget.classList.toggle("hidden", !checked)
    }
    // When unchecking the webhook, also uncheck all event checkboxes
    if (!checked && this.hasCheckboxTarget) {
      this.checkboxTargets.forEach(cb => cb.checked = false)
    }
    // When checking the webhook, check all event checkboxes by default
    if (checked && this.hasCheckboxTarget) {
      const anyChecked = this.checkboxTargets.some(cb => cb.checked)
      if (!anyChecked) {
        this.checkboxTargets.forEach(cb => cb.checked = true)
      }
    }
  }
}
