import { actionTypes } from '@servicenow/ui-core';
import { CARD_SUBMITTED, URL_OPENED, DEP_LOADED } from '../constants.js';

const { COMPONENT_BOOTSTRAPPED, COMPONENT_PROPERTY_CHANGED } = actionTypes;

export const actionHandlers = {
    [COMPONENT_BOOTSTRAPPED]: {
        effect({ properties, updateState }) {
            if (properties.forceCloseControl) {
                updateState({ controlClosed: properties.forceCloseControl });
            }
        }
    },
    [COMPONENT_PROPERTY_CHANGED]: {
        effect({ properties, updateState }) {
            if (properties.forceCloseControl) {
                updateState({ controlClosed: properties.forceCloseControl });
            }
        }
    },
    [URL_OPENED]: function ({ action: { payload } }) {
        window.open(payload.url, payload.title || '_blank');
        updateState({ controlClosed: true });
    },
    [DEP_LOADED]: function ({ state, action: { payload }, updateState }) {
        updateState({ depsLoaded: state.depsLoaded +1 });
    },
    [CARD_SUBMITTED]: function ({ action: { payload }, dispatch, updateState }) {
        updateState({ controlClosed: true });
        dispatch('VA_CONTROL#VALUE_SENT', {
            value: payload.data
        });
    },
    [URL_OPENED]: function ({ action: { payload }, updateState }) {
        window.open(payload.url, payload.title || '_blank');
    }
};