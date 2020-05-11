/*
 preferences.js - ESP3D WebUI file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

import { h } from "preact"
import { T } from "../translations"
import { useEffect } from "preact/hooks"
//import {} from "preact-feather"

/*
 * Local variables
 *
 */

let preferencesSettings
let hasError = []

/*
 * check if any active error
 */
function hasSettingError() {
    if (
        hasError["xyfeedrate"] ||
        hasError["zfeedrate"] ||
        hasError["xpos"] ||
        hasError["ypos"]
    ) {
        return true
    }
    return false
}

/*
 * check entry is valid
 */
function checkValue(entry, id) {
    hasError[id] = true
    if (entry[id].length == 0) return false
    if (id == "xyfeedrate" || id == "zfeedrate") {
        if (entry[id] < 1) return false
    }
    if (id == "xpos" || id == "ypos") {
    }
    hasError[id] = false
    return true
}

/*
 *Set state of control
 */
function setState(entry, state) {
    let controlId
    let controlIdLabel
    let controlIdUnit
    if (document.getElementById(entry + "-UI-checkbox"))
        controlId = document.getElementById(entry + "-UI-checkbox")
    if (document.getElementById(entry + "-UI-input")) {
        controlId = document.getElementById(entry + "-UI-input")
        controlIdLabel = document.getElementById(entry + "-UI-label")
        controlIdUnit = document.getElementById(entry + "-UI-unit")
    }
    if (document.getElementById(entry + "-UI-select")) {
        controlId = document.getElementById(entry + "-UI-select")
        controlIdLabel = document.getElementById(entry + "-UI-label")
    }
    if (controlId) {
        controlId.classList.remove("is-valid")
        controlId.classList.remove("is-changed")
        controlId.classList.remove("is-invalid")
        switch (state) {
            case "modified":
                controlId.classList.add("is-changed")
                break
            case "success":
                controlId.classList.add("is-valid")
                break
            case "error":
                controlId.classList.add("is-invalid")
                break
            default:
                break
        }
    }
    if (controlIdLabel) {
        controlIdLabel.classList.remove("error")
        controlIdLabel.classList.remove("success")
        controlIdLabel.classList.remove("bg-warning")
        switch (state) {
            case "modified":
                controlIdLabel.classList.add("bg-warning")
                break
            case "success":
                controlIdLabel.classList.add("success")
                break
            case "error":
                controlIdLabel.classList.add("error")
                break
            default:
                break
        }
    }
    if (controlIdUnit) {
        controlIdUnit.classList.remove("error")
        controlIdUnit.classList.remove("success")
        controlIdUnit.classList.remove("bg-warning")
        switch (state) {
            case "modified":
                controlIdUnit.classList.add("bg-warning")
                break
            case "success":
                controlIdUnit.classList.add("success")
                break
            case "error":
                controlIdUnit.classList.add("error")
                break
            default:
                break
        }
    }
}

/*
 * Change state of control according context / check
 */
function updateState(entry, index) {
    let state = "default"
    hasError[index] = false
    if (entry[index] != preferencesSettings[index]) {
        if (checkValue(entry, index)) {
            state = "modified"
        } else {
            state = "error"
        }
    }
    setState(index, state)
}

/*
 * MachineUIEntry
 */
const MachineUIEntry = ({ entry, id, label, help }) => {
    const onInput = e => {
        entry[id] = e.target.value.trim()
        updateState(entry, id)
    }
    useEffect(() => {
        updateState(entry, id)
    }, [entry[id]])
    return (
        <div class="p-2">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id={id + "-UI-label"}>
                        {label}
                    </span>
                </div>
                <input
                    id={id + "-UI-input"}
                    onInput={onInput}
                    type="number"
                    style="max-width:10em"
                    class="form-control"
                    placeholder={T("S41")}
                    value={entry[id]}
                />
                <div class="input-group-append">
                    <span
                        class="input-group-text hide-low"
                        id={id + "-UI-unit"}
                    >
                        {help}
                    </span>
                </div>
                <div
                    class="invalid-feedback text-center"
                    style="text-align:center!important"
                >
                    {T("S42")}
                </div>
            </div>
        </div>
    )
}

function defaultMachineValues(id) {
    switch (id) {
        case "xyfeedrate":
            return 100
        case "zfeedrate":
            return 10
        case "xpos":
            return 100
        case "ypos":
            return 100
        default:
            return 0
    }
}

/*
 * Printer specific settings
 *
 */
const MachineUIPreferences = ({ preferences, prefs }) => {
    preferencesSettings = preferences
    if (typeof prefs.xyfeedrate == "undefined") {
        prefs.xyfeedrate = defaultMachineValues("xyfeedrate")
    }
    if (typeof prefs.zfeedrate == "undefined") {
        prefs.zfeedrate = defaultMachineValues("zfeedrate")
    }
    if (typeof prefs.xpos == "undefined") {
        prefs.xpos = defaultMachineValues("xpos")
    }
    if (typeof prefs.ypos == "undefined") {
        prefs.ypos = defaultMachineValues("ypos")
    }
    return (
        <div class="d-flex flex-column justify-content-center border p-2">
            <MachineUIEntry
                entry={prefs}
                id="xyfeedrate"
                label={T("P10")}
                help={T("P14")}
            />
            <MachineUIEntry
                entry={prefs}
                id="zfeedrate"
                label={T("P11")}
                help={T("P14")}
            />
            <MachineUIEntry
                entry={prefs}
                id="xpos"
                label={T("P18")}
                help={T("P16")}
            />
            <MachineUIEntry
                entry={prefs}
                id="ypos"
                label={T("P19")}
                help={T("P16")}
            />
        </div>
    )
}

export { MachineUIPreferences, defaultMachineValues, hasSettingError }
