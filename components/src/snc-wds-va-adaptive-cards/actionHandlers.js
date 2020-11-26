import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { CARD_SUBMITTED, URL_OPENED } from './constants.js'

const { COMPONENT_BOOTSTRAPPED, COMPONENT_PROPERTY_CHANGED } = actionTypes;

const CARD_SUBMIT_FETCHED_SUCCESS = 'SNC_WDS_VA_AC#CARD_SUBMIT_FETCHED_SUCCESS';

export const actionHandlers = {
    [COMPONENT_BOOTSTRAPPED]: {
        effect(data) {
            const { properties: { forceCloseControl }, updateState } = data;
            if (!!forceCloseControl) {
                updateState({ controlClosed: !!forceCloseControl })
            }
        }
    },
    [COMPONENT_PROPERTY_CHANGED]: {
        effect(data) {
            const { properties: { forceCloseControl }, state: { controlClosed }, updateState } = data;
            if (!!forceCloseControl && !controlClosed) {
                updateState({ controlClosed: true })
            }
        }
    },
    [URL_OPENED]: function ({ action: { payload } }) {
        window.open(payload.url, payload.title || '_blank')
    },
    [CARD_SUBMITTED]: function ({ action: { payload } }) {
        console.log('submitted', payload);
    },
    'SNC_WDS_VA_AC#CARD_SUBMIT_FETCHED': createHttpEffect('api/users/:id', {
        method: 'POST',
        headers: {},
        pathParams: ['id'],
        dataParam: 'data',
        successActionType: CARD_SUBMIT_FETCHED_SUCCESS
    }),
    [CARD_SUBMIT_FETCHED_SUCCESS]: function () {
        console.log('submitted');
    }
};