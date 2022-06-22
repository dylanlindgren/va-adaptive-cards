import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import flight from './adaptiveCards/flight.json'
import form from './adaptiveCards/form.json'
import simple from './adaptiveCards/simple.json'
import task from './adaptiveCards/task.json'

import '../src/index.js';

const view = (state, { updateState }) => {
    return (
        <div>
            <h1>Form (Closed)</h1>
            <snc-wds-va-adaptive-card control-data={form} force-close-control={true} />
            <h1>Flight</h1>
            <snc-wds-va-adaptive-card control-data={flight} force-close-control={true} />
            <h1>Flight</h1>
            <snc-wds-va-adaptive-card control-data={flight} />
            <h1>Form</h1>
            <snc-wds-va-adaptive-card control-data={form} />
            <h1>Simple</h1>
            <snc-wds-va-adaptive-card control-data={simple} />
            <h1>Task</h1>
            <snc-wds-va-adaptive-card control-data={task} />
        </div>
    );
};

createCustomElement('snc-wds-va-adaptive-card-examples', {
    initialState: {},
    renderer: { type: snabbdom },
    view
});

const el = document.createElement('main');
document.body.appendChild(el);

el.innerHTML = '<snc-wds-va-adaptive-card-examples/>';