import {Notify} from "quasar"

function successNotify (msg) {
  Notify.create({
    message: msg,
    timeout: 2000,
    position: 'center',
    badgeStyle: "opacity: 0",
    classes: 'text-h6',
    type: 'positive'
  })
}

function failureNotify (msg) {
  Notify.create({
    message: msg,
    timeout: 2000,
    position: 'center',
    badgeStyle: "opacity: 0",
    classes: 'text-h6',
    type: 'negative'
  })
}

function warningNotify(msg) {
  Notify.create({
    message: msg,
    timeout: 1000,
    position: 'center',
    badgeStyle: "opacity: 0",
    classes: 'text-h6',
    type: 'warning'
  })
}

function ongoingNotify() {
  Notify.create({
    message: 'Please wait while application is still loading!',
    timeout: 2000,
    position: 'center',
    badgeStyle: "opacity: 0",
    classes: 'text-h6',
    type: 'ongoing',
    group: 'my-group'
  })
}

export default { successNotify, failureNotify, warningNotify, ongoingNotify}
